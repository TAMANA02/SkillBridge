import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Filter,
  Search,
  Star,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { publicDevelopers } from "../data/mockData";
import { studentService } from "../services/studentService";

const getImageUrl = (photo) => {
  if (!photo) return null;

  if (photo.startsWith("http")) {
    return photo;
  }

  return `http://127.0.0.1:8000${photo}`;
};

// Turns a backend StudentProfile record into the same card shape the mock
// publicDevelopers use, so real registered-and-verified students show up in
// this directory alongside the demo profiles. Their id is prefixed with
// "real-" so StudentProfile.jsx knows to fetch full detail from the API
// instead of looking it up in the local mock studentProfiles map.
function mapBackendStudent(record) {
  const user = record.user || {};

  const name =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    "Unnamed developer";

  return {
    id: `real-${record.id}`,
    name,
    initials: name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),

    title: record.headline || "Student developer",

    college: record.college_name || "Independent",

    location: [record.city, record.state].filter(Boolean).join(", "),

    rating: record.rating || 0,

    projects: record.projects_completed || 0,

    successRate: record.total_reviews
      ? `${Math.round((record.rating / 5) * 100)}%`
      : "—",

    responseRate: "—",

    availability: record.availability || "Not specified",

    skills: record.skills || [],

    verified: record.is_verified_student,

    followers: "—",

    image: record.profile_photo || null,

    bio: record.bio || "",

    careerObjective: record.career_objective || "",

    techStack: record.tech_stack || [],

    languages: record.languages_known || [],

    experience: record.experience || [],

    universityName: record.university_name || "",

    course: record.course || "",

    branch: record.branch || "",

    currentYear: record.current_year || "",

    graduationYear: record.graduation_year || "",
  };
}

export default function Discover() {
  const [query, setQuery] = useState("");
  const [availability, setAvailability] = useState("All availability");
  const [liveDevelopers, setLiveDevelopers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    studentService
      .list()
      .then((res) => {
        if (cancelled) return;
        const results = res?.data?.results || res?.data || [];
        setLiveDevelopers(results.map(mapBackendStudent));
      })
      .catch(() => {
        // No backend reachable in this environment, or no students yet —
        // the directory still works fine on the demo profiles below.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allDevelopers = useMemo(
    () => [...liveDevelopers, ...publicDevelopers],
    [liveDevelopers],
  );

  const filteredDevelopers = useMemo(
    () =>
      allDevelopers.filter((developer) => {
        const haystack =
          `${developer.name} ${developer.title} ${developer.college} ${developer.skills.join(" ")}`.toLowerCase();
        const matchesQuery = haystack.includes(query.toLowerCase());
        const matchesAvailability =
          availability === "All availability" ||
          (availability === "Available now"
            ? developer.availability === "Available now"
            : developer.availability !== "Available now");
        return matchesQuery && matchesAvailability;
      }),
    [allDevelopers, query, availability],
  );

  return (
    <main className="directory-page">
      <section className="directory-hero">
        <div className="container directory-hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="eyebrow">Find talent</span>
            <h1>Meet the people turning college skills into shipped work.</h1>
            <p>
              Browse verified student developers by craft, college, and
              availability. Every card opens a complete public professional
              dashboard.
            </p>
            <div className="hero-actions">
              <Link to="/teams" className="btn btn-primary">
                Explore teams <ArrowUpRight size={16} />
              </Link>
              <Link to="/colleges" className="btn btn-outline">
                Compare colleges
              </Link>
            </div>
          </motion.div>
          <div className="directory-hero-note card">
            <div className="mini-stat-label">
              <span className="status-dot" /> Live network
            </div>
            <strong>1,248</strong>
            <span>verified developers across 42 colleges</span>
            <div className="mini-stat-row">
              <span>
                <CheckCircle2 size={15} /> 94% success rate
              </span>
              <span>
                <Users size={15} /> 186 active teams
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section directory-content">
        <div className="container">
          <div className="directory-toolbar card">
            <div className="search-input-wrap">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by skill, college, or name"
                aria-label="Search developers"
              />
            </div>
            <div className="filter-wrap">
              <Filter size={15} />
              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                aria-label="Filter by availability"
              >
                <option>All availability</option>
                <option>Available now</option>
                <option>Available this week</option>
              </select>
            </div>
          </div>

          <div className="section-head directory-heading">
            <div>
              <span className="eyebrow">Verified talent directory</span>
              <h2>Developers who are ready to contribute</h2>
            </div>
            <span className="result-count">
              {filteredDevelopers.length} profiles
            </span>
          </div>

          <div className="developer-grid">
            {filteredDevelopers.map((developer, index) => (
              <DeveloperCard
                key={developer.id}
                developer={developer}
                index={index}
              />
            ))}
          </div>
          {filteredDevelopers.length === 0 && (
            <div className="empty-state card">
              <Search size={25} />
              <h3>No profiles match that search</h3>
              <p>Try a different skill, college, or availability filter.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function DeveloperCard({ developer, index }) {
  return (
    <motion.article
      className="card developer-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div className="developer-card-top">
        {developer.image ? (
          <img src={getImageUrl(developer.image)} alt={developer.name} />
        ) : (
          <div className="avatar avatar-large">{developer.initials}</div>
        )}
        <span className="availability-pill">
          <span className="status-dot" />
          {developer.availability}
        </span>
      </div>
      <div className="developer-card-heading">
        <div>
          <h3>{developer.name}</h3>
          <p>{developer.title}</p>
        </div>
        {developer.verified && (
          <CheckCircle2
            className="verified-icon"
            size={19}
            aria-label="Verified developer"
          />
        )}
      </div>
      <p className="developer-college">
        {developer.college} · {developer.location}
      </p>
      <p className="developer-bio">{developer.bio}</p>
      <div className="chip-row compact-chip-row">
        {developer.skills.map((skill) => (
          <span key={skill} className="chip">
            {skill}
          </span>
        ))}
      </div>
      <div className="developer-card-stats">
        <span>
          <strong>
            <Star size={14} /> {developer.rating}
          </strong>{" "}
          rating
        </span>
        <span>
          <strong>{developer.projects}</strong> projects
        </span>
        <span>
          <strong>{developer.successRate}</strong> success
        </span>
      </div>
      <div className="card-actions">
        <Link
          to={`/developers/${developer.id}`}
          className="btn btn-primary btn-sm"
        >
          View dashboard <ArrowUpRight size={14} />
        </Link>
        <Link
          to={`/developers/${developer.id}#contact`}
          className="btn btn-ghost btn-sm"
        >
          Hire
        </Link>
      </div>
    </motion.article>
  );
}
