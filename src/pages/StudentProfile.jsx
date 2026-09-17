import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Globe,
  Mail,
  Star,
  MapPin,
  Share2,
  MessageCircle,
  Download,
  Eye,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { publicDevelopers } from "../data/mockData";
import { studentProfiles } from "../data/studentProfiles";
import { studentService } from "../services/studentService";
import { useToast } from "../context/ToastContext";
import EmptyState from "../components/EmptyState";

const getImageUrl = (photo) => {
  if (!photo) return null;

  if (photo.startsWith("http")) {
    return photo;
  }

  return `http://127.0.0.1:8000${photo}`;
};

const PORTFOLIO_IMAGES = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
];

const SHOWCASE_IMAGES = [
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
];

const RELATED_IMAGES = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80",
];

export default function StudentProfile() {
  const { id } = useParams();

  if (!id) {
    return <MockDeveloperProfile id={id} />;
  }

  // Registered/backend developers
  if (/^\d+$/.test(id) || id.startsWith("real-")) {
    return <RealDeveloperProfile id={id} />;
  }

  // Demo/mock developers
  return <MockDeveloperProfile id={id} />;
}

// Registered students don't have the rich portfolio/showcase/badges content
// the demo profiles do (the backend only stores headline, bio, skills,
// rating, etc. — see StudentProfileSerializer), so this renders a simpler,
// honest view built from what's actually on their account.
function RealDeveloperProfile({ id }) {
  const pk = id.replace("real-", "");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    studentService
      .get(pk)
      .then((res) => {
        if (!cancelled) setStudent(res.data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pk]);

  if (error) {
    return (
      <div className="section container">
        <EmptyState
          title="Profile unavailable"
          description="This developer's profile couldn't be loaded right now."
        />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="section container">
        <EmptyState
          title="Loading profile\u2026"
          description="Fetching this developer's public profile."
        />
      </div>
    );
  }

  const user = student.user || {};
  const name =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    "SkillBridge developer";

  return (
    <section className="section">
      <div className="container">
        <div className="profile-hero-grid" style={{ marginBottom: "2rem" }}>
          {student.profile_photo ? (
            <img
              className="profile-hero-photo"
              src={getImageUrl(student.profile_photo)}
              alt={`${name} profile picture`}
            />
          ) : (
            <div className="avatar avatar-large">
              {name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div>
            {student.is_verified_student && (
              <span className="badge-pill">Verified Student</span>
            )}
            <h1
              style={{
                fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
                margin: "0.85rem 0 0.3rem",
              }}
            >
              {name}
            </h1>
            <p style={{ fontSize: "1rem" }}>
              {student.headline || "Student developer"}
            </p>
            <div className="profile-hero-meta">
              <div>
                <strong>College</strong>
                {student.college_name || "\u2014"}
              </div>
              <div>
                <strong>Availability</strong>
                {student.availability || "\u2014"}
              </div>
            </div>
            <div className="profile-stats-row">
              <div>
                <strong>
                  <Star
                    size={18}
                    style={{
                      display: "inline",
                      marginRight: 4,
                      verticalAlign: "-2px",
                    }}
                  />
                  {student.rating || "\u2014"}
                </strong>
                <span>Overall Rating</span>
              </div>
              <div>
                <strong>{student.projects_completed || 0}</strong>
                <span>Projects Completed</span>
              </div>
              <div>
                <strong>{student.total_reviews || 0}</strong>
                <span>Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {student.bio && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
              About
            </h3>
            <p>{student.bio}</p>
          </div>
        )}

        {(student.university_name ||
          student.course ||
          student.branch ||
          student.current_year ||
          student.graduation_year) && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3>Education</h3>

            {student.university_name && (
              <p>
                <strong>University:</strong> {student.university_name}
              </p>
            )}

            {student.course && (
              <p>
                <strong>Course:</strong> {student.course}
              </p>
            )}

            {student.branch && (
              <p>
                <strong>Branch:</strong> {student.branch}
              </p>
            )}

            {student.current_year && (
              <p>
                <strong>Current Year:</strong> {student.current_year}
              </p>
            )}

            {student.graduation_year && (
              <p>
                <strong>Graduation Year:</strong> {student.graduation_year}
              </p>
            )}
          </div>
        )}
        {student.career_objective && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3>Career Objective</h3>
            <p>{student.career_objective}</p>
          </div>
        )}
        {student.tech_stack?.length > 0 && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3>Tech Stack</h3>

            <div className="skills-chip-row">
              {student.tech_stack.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {student.tech_stack?.length > 0 && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3>Tech Stack</h3>

            <div className="skills-chip-row">
              {student.tech_stack.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {student.experience?.length > 0 && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3>Experience</h3>

            {student.experience.map((item, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <strong>{item.role || "Experience"}</strong>

                {item.company && <p>{item.company}</p>}
              </div>
            ))}
          </div>
        )}
        {student.languages_known?.length > 0 && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3>Languages</h3>

            <div className="skills-chip-row">
              {student.languages_known.map((language) => (
                <span className="chip" key={language}>
                  {language}
                </span>
              ))}
            </div>
          </div>
        )}
        {(student.city || student.state || student.country) && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3>Location</h3>

            <p>
              {[student.city, student.state, student.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}
        {student.skills?.length > 0 && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
              Skills
            </h3>
            <div className="skills-chip-row">
              {student.skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="chip-row">
          {student.github_url && (
            <a
              className="chip"
              href={student.github_url}
              target="_blank"
              rel="noreferrer"
            >
              <Github
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                  verticalAlign: "-2px",
                }}
              />
              GitHub
            </a>
          )}
          {student.linkedin_url && (
            <a
              className="chip"
              href={student.linkedin_url}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                  verticalAlign: "-2px",
                }}
              />
              LinkedIn
            </a>
          )}
          {student.portfolio_url && (
            <a
              className="chip"
              href={student.portfolio_url}
              target="_blank"
              rel="noreferrer"
            >
              <Globe
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                  verticalAlign: "-2px",
                }}
              />
              Portfolio
            </a>
          )}
          {user.email && (
            <a className="chip" href={`mailto:${user.email}`}>
              <Mail
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                  verticalAlign: "-2px",
                }}
              />
              Email
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function MockDeveloperProfile({ id }) {
  const { showToast } = useToast();
  const summary = publicDevelopers.find((d) => d.id === id);
  const detail = studentProfiles[id];

  if (!summary || !detail) {
    return (
      <div className="section container">
        <EmptyState
          title="Profile not found"
          description="This developer profile doesn't exist or hasn't been published yet."
        />
      </div>
    );
  }

  const p = detail;
  const heroImage = summary.image;

  const scrollToContact = () => {
    document
      .querySelector(".contact-links-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openChat = () => {
    window.location.href = `mailto:${p.contact.email}?subject=Project%20Chat%20Request`;
  };

  const downloadResume = () => {
    const content = `${p.name}\n${p.title}\n\nExperience:\n${p.experience.map((e) => `- ${e.title}`).join("\n")}\n\nSkills:\n${p.skills.join(", ")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${p.name.replace(/\s+/g, "-")}-Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Resume downloaded");
  };

  const shareProfile = async () => {
    const shareData = {
      title: `SkillBridge | ${p.name}`,
      text: "Check out this verified student profile on SkillBridge.",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!");
      }
    } catch {
      showToast("Unable to share right now");
    }
  };

  return (
    <>
      <section className="profile-hero">
        <div className="container profile-hero-grid">
          <motion.img
            className="profile-hero-photo"
            src={heroImage}
            alt={`${p.name} profile picture`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="badge-pill">Available for Work</span>
            <h1
              style={{
                fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
                margin: "0.85rem 0 0.3rem",
              }}
            >
              {p.name}
            </h1>
            <p style={{ fontSize: "1rem" }}>
              Verified Student &middot; {p.title}
            </p>
            <div className="profile-hero-meta">
              <div>
                <strong>College</strong>
                {p.college}
              </div>
              <div>
                <strong>Branch</strong>
                {p.branch}
              </div>
              <div>
                <strong>Year</strong>
                {p.year}
              </div>
              <div>
                <strong>
                  <MapPin
                    size={12}
                    style={{ display: "inline", marginRight: 4 }}
                  />
                  Location
                </strong>
                {p.location}
              </div>
            </div>
            <div className="profile-stats-row">
              <div>
                <strong>
                  <Star
                    size={18}
                    style={{
                      display: "inline",
                      marginRight: 4,
                      verticalAlign: "-2px",
                    }}
                  />
                  {p.rating}
                </strong>
                <span>Overall Rating</span>
              </div>
              <div>
                <strong>{p.projectsCompleted}</strong>
                <span>Projects Completed</span>
              </div>
              <div>
                <strong>{p.hireRequests}</strong>
                <span>Hire Requests</span>
              </div>
              <div>
                <strong>{p.responseRate}</strong>
                <span>Response Rate</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="profile-actions"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={scrollToContact}
            >
              Hire {p.name.split(" ")[0]}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={openChat}
            >
              <MessageCircle size={16} /> Chat
            </button>
            <button
              type="button"
              className="btn btn-muted"
              onClick={downloadResume}
            >
              <Download size={16} /> Resume
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={shareProfile}
            >
              <Share2 size={16} /> Share
            </button>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">About Student</span>
            <h2>Who {p.name.split(" ")[0]} Is</h2>
            <p>{p.about}</p>
          </div>
          <div className="grid-3">
            <div className="card">
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
                Career Interests
              </h3>
              <p>{p.careerInterests}</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
                Goals
              </h3>
              <p>{p.goals}</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>
                Specialization
              </h3>
              <p>{p.specialization}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Skills</span>
            <h2>Technical expertise</h2>
          </div>
          <div className="skills-chip-row">
            {p.skills.map((skill) => (
              <span key={skill} className="skill-chip">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Portfolio</span>
            <h2>Selected projects</h2>
            <p>
              Modern cards showcasing polished web work, stack details and live
              project links.
            </p>
          </div>
          <div className="portfolio-grid">
            {p.portfolio.map((project, i) => (
              <motion.div
                key={project.title}
                className="card portfolio-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <img src={PORTFOLIO_IMAGES[i]} alt={project.title} />
                <span className="badge-pill lavender">{project.category}</span>
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <p className="stack">{project.stack}</p>
                <p style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}>
                  Completed: {project.completed}
                </p>
                <div className="portfolio-links">
                  <button type="button" className="btn btn-outline btn-sm">
                    GitHub
                  </button>
                  <button type="button" className="btn btn-muted btn-sm">
                    Live Demo
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Showcase Projects</span>
            <h2>Innovative work highlights</h2>
          </div>
          <div className="grid-2">
            {p.showcase.map((project, i) => (
              <motion.div
                key={project.title}
                className="card portfolio-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <img src={SHOWCASE_IMAGES[i]} alt={project.title} />
                <span className="badge-pill orange">Innovation</span>
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <p className="stack">
                  {project.stack} &middot; {project.rating}
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-faint)",
                    marginTop: "0.5rem",
                  }}
                >
                  {project.likes} likes &middot; {project.comments} comments
                  &middot;{" "}
                  <Eye
                    size={12}
                    style={{ display: "inline", verticalAlign: "-1px" }}
                  />{" "}
                  {project.views}
                </p>
                <div className="portfolio-links">
                  <button type="button" className="btn btn-outline btn-sm">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Experience</span>
            <h2>Professional background</h2>
          </div>
          <div className="timeline-grid">
            {p.experience.map((item) => (
              <div key={item.title} className="card timeline-item">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Certifications</span>
            <h2>Trusted credentials</h2>
          </div>
          <div className="chip-row">
            {p.certifications.map((cert) => (
              <span key={cert} className="chip">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Ratings & Reviews</span>
            <h2>Trusted feedback</h2>
          </div>
          <div className="stats-strip" style={{ marginBottom: "2rem" }}>
            <StatsInline value={p.rating} label="Average Stars" />
            <StatsInline value={p.reviews.length * 64} label="Total Reviews" />
            <StatsInline value="95%" label="Client Satisfaction" />
          </div>
          <div className="grid-2">
            {p.reviews.map((review) => (
              <div key={review.name} className="card review-card">
                <div className="reviewer">
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.role}</span>
                  </div>
                  <span className="badge-pill">{review.rating}</span>
                </div>
                <p>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Project Analytics</span>
            <h2>Performance metrics</h2>
          </div>
          <div className="stats-strip">
            <StatsInline
              value={p.analytics.portfolioViews}
              label="Portfolio Views"
            />
            <StatsInline
              value={p.analytics.projectViews}
              label="Project Views"
            />
            <StatsInline
              value={p.analytics.hireRequests}
              label="Hire Requests"
            />
            <StatsInline
              value={p.analytics.projectsCompleted}
              label="Projects Completed"
            />
            <StatsInline
              value={p.analytics.repeatClients}
              label="Repeat Clients"
            />
            <StatsInline
              value={p.analytics.responseTime}
              label="Response Time"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Badges & Achievements</span>
            <h2>Recognition</h2>
          </div>
          <div className="badges-row">
            {p.badges.map((badge) => (
              <span key={badge} className="achievement-chip">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt contact-links-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Contact Links</span>
            <h2>Connect with {p.name.split(" ")[0]}</h2>
          </div>
          <div className="chip-row">
            <a className="chip" href="#github">
              <Github
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                  verticalAlign: "-2px",
                }}
              />
              GitHub
            </a>
            <a className="chip" href="#linkedin">
              <Linkedin
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                  verticalAlign: "-2px",
                }}
              />
              LinkedIn
            </a>
            <a className="chip" href="#portfolio">
              <Globe
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                  verticalAlign: "-2px",
                }}
              />
              Portfolio Website
            </a>
            <a className="chip" href={`mailto:${p.contact.email}`}>
              <Mail
                size={14}
                style={{
                  display: "inline",
                  marginRight: 6,
                  verticalAlign: "-2px",
                }}
              />
              Email
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Related Developers</span>
            <h2>More students you may like</h2>
          </div>
          <div className="grid-3">
            {p.related.map((dev, i) => (
              <Link
                to={`/developers/${dev.id}`}
                key={dev.name}
                className="card related-dev-card"
              >
                <img src={RELATED_IMAGES[i]} alt={dev.name} />
                <h5>{dev.name}</h5>
                <p className="stack-line">{dev.stack}</p>
                <span className="badge-pill">
                  {dev.rating}{" "}
                  <Star
                    size={11}
                    style={{ display: "inline", marginLeft: 3 }}
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function StatsInline({ value, label }) {
  return (
    <div className="card stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
