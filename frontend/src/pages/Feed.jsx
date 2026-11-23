import { motion } from 'framer-motion';
import { Bookmark, CheckCircle2, Image, Link as LinkIcon, MessageCircle, MoreHorizontal, Send, Share2, ThumbsUp, UserPlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { feedPosts, publicDevelopers, teams as demoTeams } from '../data/mockData';
import { feedService } from '../services/feedService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function initialsFor(name = '') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SB';
}

function normalizePost(raw) {
  const authorIsObject = raw.author && typeof raw.author === 'object';
  const author = authorIsObject ? raw.author : {};
  const authorName = authorIsObject
    ? `${author.first_name || ''} ${author.last_name || ''}`.trim()
    : (raw.author || '');
  const commentsIsArray = Array.isArray(raw.comments);
  const commentItems = commentsIsArray
    ? raw.comments.map((comment) => ({ body: comment.body, author: comment.author }))
    : (raw.commentItems || []);
  const commentsCount = raw.comments_count
    ?? (commentsIsArray ? commentItems.length : (typeof raw.comments === 'number' ? raw.comments : commentItems.length));
  return {
    ...raw,
    author: authorName || 'SkillBridge member',
    authorId: authorIsObject ? author.id : raw.authorId,
    authorRole: authorIsObject ? author.role : raw.authorRole,
    authorTitle: raw.authorTitle || author.role || 'SkillBridge member',
    college: raw.college || 'SkillBridge community',
    initials: raw.initials || initialsFor(authorName),
    avatar: raw.avatar || author.avatar,
    timestamp: raw.timestamp || (raw.created_at ? new Date(raw.created_at).toLocaleDateString() : 'Recently'),
    text: raw.text || raw.body || '',
    tags: raw.tags || [],
    likes: raw.likes ?? raw.likes_count ?? 0,
    comments: commentsCount,
    shares: raw.shares ?? raw.shares_count ?? 0,
    liked: raw.liked ?? raw.viewer_liked ?? false,
    saved: raw.saved ?? raw.viewer_saved ?? false,
    following: raw.following ?? raw.viewer_following ?? false,
    commentItems,
  };
}

// Where does clicking this post's author actually go? Prefer a known demo
// developer or team profile by name; fall back to the real backend-sourced
// student profile route when the post came from the API and we know the
// author's id; otherwise there's nowhere real to send them, so the caller
// renders plain text instead of a dead link.
function resolveAuthorPath(post) {
  const dev = publicDevelopers.find((d) => d.name.toLowerCase() === post.author.toLowerCase());
  if (dev) return `/developers/${dev.id}`;
  const team = demoTeams.find((t) => t.name.toLowerCase() === post.author.toLowerCase());
  if (team) return `/teams/${team.slug}`;
  if (post.authorId && post.authorRole === 'student') return `/developers/real-${post.authorId}`;
  return null;
}

export default function Feed() {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState(feedPosts.map(normalizePost));
  const [draft, setDraft] = useState('');
  const [draftImage, setDraftImage] = useState(null);
  const [draftLink, setDraftLink] = useState('');
  const [commentOpen, setCommentOpen] = useState(null);
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    let active = true;
    feedService.list({ ordering: '-created_at' }).then(({ data }) => {
      if (!active) return;
      const items = data.results || data;
      if (Array.isArray(items) && items.length) setPosts(items.map(normalizePost));
    }).catch(() => {
      if (active) showToast('Showing the demo feed until the API is available');
    });
    return () => { active = false; };
  }, [showToast]);

  const updatePost = (id, patch) => setPosts((items) => items.map((post) => post.id === id ? { ...post, ...patch } : post));
  const requireAuth = () => {
    if (!isAuthenticated) { showToast('Sign in to interact with community posts'); return false; }
    return true;
  };

  const toggleLike = async (post) => {
    if (!requireAuth()) return;
    try {
      const { data } = await feedService.like(post.id);
      updatePost(post.id, { liked: data.liked, likes: data.likes_count });
    } catch {
      // Demo posts (and any offline moment) don't have a real backend row to
      // toggle — fall back to an optimistic local update so the button
      // still visibly works instead of silently doing nothing.
      updatePost(post.id, { liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) });
    }
  };

  const toggleSave = async (post) => {
    if (!requireAuth()) return;
    try {
      const { data } = await feedService.save(post.id);
      updatePost(post.id, { saved: data.saved });
      showToast(data.saved ? 'Post saved' : 'Removed from saved posts');
    } catch {
      const saved = !post.saved;
      updatePost(post.id, { saved });
      showToast(saved ? 'Post saved' : 'Removed from saved posts');
    }
  };

  const toggleFollow = async (post) => {
    if (!requireAuth()) return;
    try {
      const { data } = await feedService.followAuthor(post.id);
      updatePost(post.id, { following: data.following });
      showToast(data.following ? `Following ${post.author}` : `Unfollowed ${post.author}`);
    } catch {
      const following = !post.following;
      updatePost(post.id, { following });
      showToast(following ? `Following ${post.author}` : `Unfollowed ${post.author}`);
    }
  };

  const sharePost = async (post) => {
    if (!requireAuth()) return;
    const link = `${window.location.origin}/feed#${post.id}`;
    try {
      const { data } = await feedService.share(post.id);
      updatePost(post.id, { shares: data.shares_count });
    } catch {
      updatePost(post.id, { shares: post.shares + 1 });
    } finally {
      try {
        await navigator.clipboard?.writeText(link);
        showToast('Post link copied');
      } catch {
        showToast(`Share link: ${link}`);
      }
    }
  };

  const submitComment = async (post) => {
    const body = (newComments[post.id] || '').trim();
    if (!body || !requireAuth()) return;
    try {
      const { data } = await feedService.comment(post.id, body);
      updatePost(post.id, { comments: post.comments + 1, commentItems: [...post.commentItems, data] });
    } catch {
      updatePost(post.id, {
        comments: post.comments + 1,
        commentItems: [...post.commentItems, { body, author: { first_name: user?.first_name || 'You' } }],
      });
    }
    setNewComments((items) => ({ ...items, [post.id]: '' }));
  };

  const publishPost = async () => {
    if (!draft.trim() || !requireAuth()) return;
    const text = draftLink ? `${draft.trim()}\n\n${draftLink}` : draft.trim();
    try {
      const { data } = await feedService.create({ body: text, tags: [], image: draftImage || undefined });
      setPosts((items) => [normalizePost(data), ...items]);
    } catch {
      const name = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'You';
      setPosts((items) => [
        normalizePost({
          id: `local-${Date.now()}`,
          author: name,
          authorTitle: user?.role === 'client' ? 'Client' : 'Student developer',
          college: 'SkillBridge community',
          timestamp: 'Just now',
          text,
          tags: [],
          image: draftImage,
          likes: 0,
          comments: 0,
          shares: 0,
        }),
        ...items,
      ]);
    }
    setDraft('');
    setDraftImage(null);
    setDraftLink('');
    showToast('Your update is live on SkillBridge');
  };

  return (
    <main className="feed-page">
      <section className="feed-intro">
        <div className="container feed-intro-inner">
          <div>
            <span className="eyebrow">SkillBridge community</span>
            <h1>See what college builders are shipping.</h1>
            <p>A professional feed for project updates, team opportunities, and the ideas moving the network forward.</p>
          </div>
          <div className="feed-intro-stats"><span><strong>4.2k</strong> members sharing</span><span><strong>186</strong> active teams</span></div>
        </div>
      </section>
      <div className="container feed-layout">
        <div className="feed-main">
          <Composer
            draft={draft}
            setDraft={setDraft}
            draftImage={draftImage}
            setDraftImage={setDraftImage}
            draftLink={draftLink}
            setDraftLink={setDraftLink}
            publishPost={publishPost}
          />
          <div className="feed-sort"><span>Latest from your network</span><button type="button" className="btn btn-ghost btn-sm">Most relevant <MoreHorizontal size={14} /></button></div>
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              onLike={toggleLike}
              onSave={toggleSave}
              onFollow={toggleFollow}
              onShare={sharePost}
              commentOpen={commentOpen === post.id}
              setCommentOpen={setCommentOpen}
              commentText={newComments[post.id] || ''}
              setCommentText={(value) => setNewComments((items) => ({ ...items, [post.id]: value }))}
              submitComment={submitComment}
            />
          ))}
        </div>
        <aside className="feed-sidebar">
          <div className="card feed-sidebar-card">
            <span className="eyebrow">Build your reputation</span>
            <h3>Complete your public dashboard</h3>
            <p>Add projects, skills, and a team to make your work easier to trust.</p>
            <Link
              to={!isAuthenticated ? '/login' : user?.role === 'client' ? '/client/profile' : '/student/profile'}
              className="btn btn-primary btn-sm"
            >
              Update profile <Send size={14} />
            </Link>
          </div>
          <div className="card feed-sidebar-card">
            <span className="eyebrow">Trending skills</span>
            <div className="trend-list"><span>#React <small>+28%</small></span><span>#MachineLearning <small>+22%</small></span><span>#ProductDesign <small>+18%</small></span><span>#TeamHiring <small>+14%</small></span></div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Composer({ draft, setDraft, draftImage, setDraftImage, draftLink, setDraftLink, publishPost }) {
  const fileInputRef = useRef(null);

  const onPickMedia = () => fileInputRef.current?.click();
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraftImage(reader.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const onAddLink = () => {
    const url = window.prompt('Paste a project link');
    if (url) setDraftLink(url.trim());
  };

  return (
    <section className="card composer">
      <div className="avatar">YO</div>
      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Share a project update, lesson, or opportunity..." aria-label="Create a post" />

      {draftImage && (
        <div className="composer-preview">
          <img src={draftImage} alt="Attached media preview" />
          <button type="button" className="icon-button" onClick={() => setDraftImage(null)} aria-label="Remove media"><X size={14} /></button>
        </div>
      )}
      {draftLink && (
        <div className="composer-link-chip">
          <LinkIcon size={13} /> {draftLink}
          <button type="button" onClick={() => setDraftLink('')} aria-label="Remove link"><X size={13} /></button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onFileChange} />

      <div className="composer-footer">
        <div className="composer-tools">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onPickMedia}><Image size={15} /> Media</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onAddLink}><LinkIcon size={15} /> Project link</button>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={publishPost} disabled={!draft.trim()}>Publish update <Send size={14} /></button>
      </div>
    </section>
  );
}

function PostCard({ post, index, onLike, onSave, onFollow, onShare, commentOpen, setCommentOpen, commentText, setCommentText, submitComment }) {
  const authorPath = resolveAuthorPath(post);
  const AuthorWrap = authorPath ? Link : 'div';
  const authorProps = authorPath ? { to: authorPath } : {};

  return (
    <motion.article className="card post-card" id={post.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 3) * 0.06 }}>
      <div className="post-header">
        <AuthorWrap className="post-author" {...authorProps}>
          <div className="post-avatar">{post.avatar ? <img src={post.avatar} alt={post.author} /> : post.initials}</div>
          <span><strong>{post.author} {post.author !== 'You' && <CheckCircle2 size={14} />}</strong><small>{post.authorTitle} \u00b7 {post.college}</small><small>{post.timestamp}</small></span>
        </AuthorWrap>
        <button type="button" className={`follow-button ${post.following ? 'following' : ''}`} onClick={() => onFollow(post)}>{post.following ? 'Following' : <><UserPlus size={14} /> Follow</>}</button>
      </div>
      <p className="post-copy">{post.text}</p>
      <div className="chip-row compact-chip-row">{post.tags.map((tag) => <span className="chip" key={tag}>#{tag}</span>)}</div>
      {post.image && <img className="post-image" src={post.image} alt={`${post.project || 'Project'} update`} />}
      <div className="post-meta"><span><ThumbsUp size={13} /> {post.likes} likes</span><span>{post.comments} comments \u00b7 {post.shares} shares</span></div>
      <div className="post-actions">
        <button type="button" className={post.liked ? 'active' : ''} onClick={() => onLike(post)}><ThumbsUp size={16} /> Like</button>
        <button type="button" className={commentOpen ? 'active' : ''} onClick={() => setCommentOpen(commentOpen ? null : post.id)}><MessageCircle size={16} /> Comment</button>
        <button type="button" onClick={() => onShare(post)}><Share2 size={16} /> Share</button>
        <button type="button" className={post.saved ? 'active' : ''} onClick={() => onSave(post)}><Bookmark size={16} /> Save</button>
      </div>
      {commentOpen && (
        <div className="comment-area">
          <div className="comment-input">
            <div className="avatar">YO</div>
            <input value={commentText} onChange={(event) => setCommentText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submitComment(post); }} placeholder="Add a thoughtful comment..." aria-label="Write a comment" />
            <button type="button" className="icon-button" onClick={() => submitComment(post)} aria-label="Submit comment"><Send size={15} /></button>
          </div>
          {post.commentItems.map((comment, commentIndex) => (
            <p className="comment-line" key={`${comment.body}-${commentIndex}`}><strong>{comment.author?.first_name || 'Member'}</strong> {comment.body}</p>
          ))}
        </div>
      )}
    </motion.article>
  );
}
