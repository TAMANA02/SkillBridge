import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Medal,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  colleges as demoColleges,
  publicDevelopers,
  teams as demoTeams,
} from "../data/mockData";
import { collegeService } from "../services/collegeService";
import { useToast } from "../context/ToastContext";

const getImageUrl = (photo) => {
  if (!photo) return null;

  if (photo.startsWith("http")) {
    return photo;
  }

  return `http://127.0.0.1:8000${photo}`;
};

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SB";

function normalizeDeveloper(raw) {
  const name =
    `${raw.user?.first_name || ""} ${raw.user?.last_name || ""}`.trim() ||
    "SkillBridge developer";

  return {
    id: raw.id,
    name,
    title:
      raw.headline ||
      (raw.experience_level
        ? `${raw.experience_level} developer`
        : "Developer"),
    rating: raw.rating ?? 0,
    projects: raw.projects_completed ?? 0,
    image: getImageUrl(raw.profile_photo || raw.user?.avatar),
  };
}
function normalizeTeam(raw) {
  return {
    slug: raw.slug,
    name: raw.name,
    description:
      raw.description ||
      "A collaborative college team building real client outcomes.",
    members: raw.members || [],
    completed: raw.completed_projects ?? 0,
  };
}

function normalizeCollege(raw) {
  const score = Math.round(raw.performance_score ?? 0);
  return {
    ...raw,
    slug: raw.slug,
    name: raw.name,
    city: raw.location || "",
    score: Number.isFinite(score) ? score : 0,
    accent: "#6366f1",
    trend: "",
    summary:
      raw.description ||
      `The SkillBridge community at ${raw.name}, ranked by real client outcomes.`,
    projects: raw.projects_completed ?? 0,
    rating: raw.client_rating ?? 0,
    successRate: raw.success_rate != null ? `${raw.success_rate}%` : "—",
    developers: raw.total_developers ?? 0,
    teams: raw.total_teams ?? 0,
  };
}

export default function CollegeProfile() {
  const { slug } = useParams();
  const { showToast } = useToast();
  const [college, setCollege] = useState(
    () => demoColleges.find((item) => item.slug === slug) || demoColleges[0],
  );
  const [displayDevelopers, setDisplayDevelopers] = useState(
    publicDevelopers.slice(0, 3),
  );
  const [displayTeams, setDisplayTeams] = useState(demoTeams.slice(0, 2));
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let active = true;
    collegeService
      .get(slug)
      .then(({ data }) => {
        if (!active || !data) return;
        setCollege(normalizeCollege(data));
        if (Array.isArray(data.top_developers) && data.top_developers.length) {
          setDisplayDevelopers(data.top_developers.map(normalizeDeveloper));
        }
        if (Array.isArray(data.top_teams) && data.top_teams.length) {
          setDisplayTeams(data.top_teams.map(normalizeTeam));
        }
        setIsLive(true);
      })
      .catch(() => {
        if (active)
          showToast(
            "Showing demo college data until the database API is available",
          );
      });
    return () => {
      active = false;
    };
  }, [slug, showToast]);

  if (!college) {
    return (
      <main className="profile-page college-profile-page">
        <section className="section">
          <div className="container">
            <p>College not found.</p>
            <Link to="/colleges" className="back-link">
              <ArrowLeft size={15} /> Back to leaderboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page college-profile-page">
      <section
        className="profile-hero college-profile-hero"
        style={{ "--college-accent": college.accent }}
      >
        <div className="container profile-hero-grid">
          <div className="college-emblem">
            <Medal size={36} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="badge-pill">
              <CheckCircle2 size={13} />{" "}
              {isLive ? "Verified College Community" : "Demo preview"}
            </span>
            <h1>{college.name}</h1>
            <p>{college.city}</p>
            <div className="profile-hero-meta">
              <div>
                <strong>Performance</strong>
                {college.score}/100
              </div>
              {college.trend && (
                <div>
                  <strong>Momentum</strong>
                  <TrendingUp size={13} /> {college.trend}
                </div>
              )}
            </div>
            <div className="profile-stats-row">
              <div>
                <strong>{college.projects}</strong>
                <span>Projects delivered</span>
              </div>
              <div>
                <strong>{college.rating}</strong>
                <span>Client rating</span>
              </div>
              <div>
                <strong>{college.successRate}</strong>
                <span>Success rate</span>
              </div>
              <div>
                <strong>{college.developers}</strong>
                <span>Developers</span>
              </div>
            </div>
          </motion.div>
          <div className="profile-actions">
            <Link to="/discover" className="btn btn-primary">
              Find developers
            </Link>
            <Link to="/teams" className="btn btn-outline">
              Explore teams
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Link to="/colleges" className="back-link">
            <ArrowLeft size={15} /> Back to leaderboard
          </Link>
          <div className="profile-section-grid college-overview">
            <div>
              <span className="eyebrow">The community</span>
              <h2>{college.summary}</h2>
              <p>
                From individual specialists to cross-functional teams, this
                college's SkillBridge network gives clients a transparent view
                of the people and outcomes behind the ranking.
              </p>
            </div>
            <div className="card score-card">
              <span className="eyebrow">Performance score</span>
              <strong>
                {college.score}
                <small>/100</small>
              </strong>
              <div className="progress-track">
                <i
                  style={{
                    width: `${Math.min(college.score, 100)}%`,
                    background: college.accent,
                  }}
                />
              </div>
              {college.trend && (
                <span>
                  <TrendingUp size={14} /> {college.trend} compared with last
                  month
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Top developers</span>
            <h2>People making the ranking real</h2>
          </div>
          {displayDevelopers.length ? (
            <div className="mini-profile-grid">
              {displayDevelopers.map((developer) => (
                <Link
                  to={
                    developer.id
                      ? `/developers/real-${developer.id}`
                      : "/discover"
                  }
                  className="card mini-profile-card"
                  key={developer.id || developer.name}
                >
                  {developer.image ? (
                    <img src={developer.image} alt={developer.name} />
                  ) : (
                    <div className="avatar avatar-large">
                      {initials(developer.name)}
                    </div>
                  )}
                  <div>
                    <h3>{developer.name}</h3>
                    <p>{developer.title}</p>
                    <span>
                      <Star size={13} /> {developer.rating} ·{" "}
                      {developer.projects} projects
                    </span>
                  </div>
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-state-inline">
              No developers registered from this college yet.
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Top teams</span>
            <h2>Collaboration at campus scale</h2>
          </div>
          {displayTeams.length ? (
            <div className="mini-team-grid">
              {displayTeams.map((team) => (
                <Link
                  to={`/teams/${team.slug}`}
                  className="card mini-team-card"
                  key={team.slug}
                >
                  <div className="avatar avatar-large">
                    {initials(team.name)}
                  </div>
                  <div>
                    <h3>{team.name}</h3>
                    <p>{team.description}</p>
                    <span>
                      <Users size={13} /> {team.members.length} members ·{" "}
                      {team.completed} projects
                    </span>
                  </div>
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-state-inline">
              No teams registered from this college yet.
            </p>
          )}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container college-cta">
          <div>
            <span className="eyebrow">Hire with confidence</span>
            <h2>
              See the work. Meet the people. Start the right conversation.
            </h2>
          </div>
          <Link to="/feed" className="btn btn-primary">
            Explore project updates <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
