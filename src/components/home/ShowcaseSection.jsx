import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { showcaseProjects } from '../../data/mockData';

const FILTERS = ['All', 'Web Development', 'AI Development', 'UI/UX Design', 'Digital Marketing'];
const RANKINGS = ['Top Rated', 'Newest', 'Most Viewed'];

export default function ShowcaseSection() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [ranking, setRanking] = useState('Top Rated');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return showcaseProjects.filter((p) => {
      const matchesQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = filter === 'All' || p.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <section className="section section-alt" id="showcase">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Project Showcase</span>
          <h2>Innovative work highlights</h2>
          <p>Browse featured projects delivered by verified student developers on SkillBridge.</p>
        </div>

        <div className="showcase-layout">
          <div>
            <div className="showcase-toolbar">
              <div className="showcase-search-input">
                <Search size={16} />
                <input
                  placeholder="Search projects or skills"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="chip-row" role="group" aria-label="Filter by category">
                {FILTERS.map((f) => (
                  <button key={f} type="button" className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>
              <div className="chip-row" role="group" aria-label="Sort by">
                {RANKINGS.map((r) => (
                  <button key={r} type="button" className={`chip ${ranking === r ? 'active' : ''}`} onClick={() => setRanking(r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="showcase-grid">
              {filtered.map((project, i) => (
                <motion.article
                  key={project.title}
                  className="card card-hover showcase-card"
                  onClick={() => setSelected(project)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (i % 6) * 0.05 }}
                >
                  <h4>{project.title}</h4>
                  <p>{project.category}</p>
                  <div className="showcase-card-tags">
                    {project.tags.map((tag) => <span key={tag} className="showcase-card-tag">{tag}</span>)}
                  </div>
                </motion.article>
              ))}
              {!filtered.length && (
                <p style={{ gridColumn: '1 / -1' }}>No projects match your search.</p>
              )}
            </div>
          </div>

          <aside className="card showcase-detail-card">
            {selected ? (
              <>
                <div className="panel-heading">
                  <div>
                    <span className="badge-pill lavender">{selected.category}</span>
                    <h3 style={{ marginTop: '0.6rem' }}>{selected.title}</h3>
                  </div>
                  <button type="button" className="icon-button" aria-label="Close details" onClick={() => setSelected(null)}>
                    <X size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem' }}>
                  <span className="badge-pill">Innovation Score {selected.score} / 100</span>
                  <span className="status-badge">Position: {selected.position}</span>
                </div>
                <p>{selected.title} demonstrates practical results and strong delivery for clients seeking reliable student talent.</p>
                <div className="showcase-detail-meta">
                  <div className="detail-row"><span>Visibility</span><p>{selected.visibility}</p></div>
                  <div className="detail-row"><span>Category</span><p>{selected.categoryLabel}</p></div>
                  <div className="detail-row"><span>Tech stack</span><p>{selected.techStack}</p></div>
                  <div className="detail-row"><span>Community rating</span><p>{selected.communityRating}</p></div>
                  <div className="detail-row"><span>Client feedback</span><p>{selected.clientFeedback}</p></div>
                  <div className="detail-row"><span>Client status</span><p>{selected.clientStatus}</p></div>
                  <div className="detail-row"><span>Skills</span><p>{selected.skills}</p></div>
                  <div className="detail-row"><span>Status</span><p>{selected.status}</p></div>
                  <div className="detail-row"><span>Budget</span><p>{selected.budget}</p></div>
                  <div className="detail-row"><span>Deadline</span><p>{selected.deadline}</p></div>
                </div>
                <button type="button" className="btn btn-primary btn-block">Request similar work</button>
              </>
            ) : (
              <h3>Select a project to preview</h3>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
