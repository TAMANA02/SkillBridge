import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowUpRight, Search, Users, Newspaper, Trophy } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import StatsCard from '../components/StatsCard';
import ShowcaseSection from '../components/home/ShowcaseSection';
import LeaderboardSection from '../components/home/LeaderboardSection';
import SearchSection from '../components/home/SearchSection';
import ContactSection from '../components/home/ContactSection';
import { services, aiProjectCompletionItems } from '../data/mockData';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero section" id="home">
        <div className="container hero-grid">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <span className="eyebrow">Connecting clients with student talent</span>
            <h1>Bridge Your Ideas with Verified Student Developers</h1>
            <p>
              SkillBridge connects verified college student developers with clients for real-world digital
              projects while helping students gain practical experience and build professional portfolios.
            </p>
            <div className="hero-actions">
              <Link to="/login?role=client" className="btn btn-primary">Client</Link>
              <Link to="/student/dashboard" className="btn btn-outline">Student</Link>
              <Link to="/services" className="btn btn-muted">Trending Weekly Projects</Link>
            </div>
            <ul className="hero-list">
              <li><CheckCircle2 size={18} /> Verified student developers</li>
              <li><CheckCircle2 size={18} /> Client-rated portfolio work</li>
              <li><CheckCircle2 size={18} /> Fast project discovery</li>
            </ul>
          </motion.div>

          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}>
            <div className="card hero-visual-card">
              <div className="hero-visual-top">
                <div>
                  <span className="eyebrow">Project Match</span>
                  <p style={{ marginTop: '0.4rem', color: 'var(--text)', fontWeight: 600 }}>Verified Student Devs</p>
                </div>
                <span className="badge-pill">Live</span>
              </div>
              <div className="hero-connection">
                <div className="connection-node lime">Client</div>
                <div className="connection-line" />
                <div className="connection-node">SB</div>
                <div className="connection-line" />
                <div className="connection-node lime">Student</div>
              </div>
              <div className="hero-stat-huge">82%</div>
              <p className="hero-visual-caption">Average project completion rate across active student cohorts.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client / Student entry */}
      <section className="section" id="clientEntry">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Client Access</span>
            <h2>Login or create a client account</h2>
            <p>Start hiring student developers, post projects, and manage all client activity from one trusted space.</p>
          </div>
          <div className="split-panels">
            <motion.div className="card entry-panel" {...fadeUp}>
              <h3>Client Login</h3>
              <p>Already registered? Access your dashboard and manage live projects.</p>
              <Link to="/login?role=client" className="btn btn-outline">Client Login</Link>
            </motion.div>
            <motion.div className="card entry-panel" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}>
              <h3>Create Client Account</h3>
              <p>Register your business and start posting projects for verified student developers.</p>
              <Link to="/signup?role=client" className="btn btn-primary">Create Account</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="section section-alt" id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Our services</span>
            <h2>Digital services for every stage of your project</h2>
            <p>From design and deployment to AI and security, SkillBridge provides student-led talent for modern digital initiatives.</p>
          </div>
          <div className="grid-3">
            {services.slice(0, 6).map((service, i) => (
              <ServiceCard key={service.name} service={service} index={i} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/services" className="btn btn-outline">
              View all services <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Project Completion */}
      <section className="section" id="aiProjectCompletion">
        <div className="container">
          <div className="split-panels" style={{ alignItems: 'center' }}>
            <motion.div {...fadeUp}>
              <span className="eyebrow">AI Project Completion</span>
              <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', margin: '1rem 0' }}>
                Complete your AI-generated projects with verified student developers
              </h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Designed for users who have already created a website or application using AI tools but are
                unable to finish the remaining development. Verified student developers on SkillBridge help
                transform AI-generated or partially completed projects into fully functional, production-ready
                applications.
              </p>
              <Link to="/ai-project-completion" className="btn btn-primary">Learn more</Link>
            </motion.div>
            <motion.div className="card" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}>
              <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                How SkillBridge helps
              </h4>
              <div className="chip-row">
                {aiProjectCompletionItems.slice(0, 8).map((item) => (
                  <span key={item} className="chip">{item}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section section-alt" id="about">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">About SkillBridge</span>
            <h2>Built for students and clients alike</h2>
            <p>
              SkillBridge is a marketplace where verified college student developers gain real-world experience
              while clients get reliable, affordable, and closely-managed digital work.
            </p>
          </div>
          <div className="grid-3">
            <motion.div className="card" {...fadeUp}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>For Students</h3>
              <p>Build a verified portfolio, gain client-rated experience, and grow into a confident professional developer.</p>
            </motion.div>
            <motion.div className="card" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>For Clients</h3>
              <p>Post real projects, discover verified talent quickly, and manage delivery from one trusted dashboard.</p>
            </motion.div>
            <motion.div className="card" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.16 }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem' }}>For Everyone</h3>
              <p>A transparent, fast, and fair marketplace connecting ambition with opportunity.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section ecosystem-section" id="ecosystem">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">The SkillBridge ecosystem</span>
            <h2>More than a marketplace</h2>
            <p>Discover the people, teams, projects, and college communities behind the work.</p>
          </div>
          <div className="ecosystem-grid">
            <Link to="/discover" className="card ecosystem-card"><span className="ecosystem-icon"><Search size={19} /></span><span><strong>Find talent</strong><small>Browse verified developer dashboards</small></span><ArrowUpRight size={16} /></Link>
            <Link to="/teams" className="card ecosystem-card"><span className="ecosystem-icon"><Users size={19} /></span><span><strong>Find teams</strong><small>Hire coordinated college teams</small></span><ArrowUpRight size={16} /></Link>
            <Link to="/feed" className="card ecosystem-card"><span className="ecosystem-icon"><Newspaper size={19} /></span><span><strong>Community feed</strong><small>See what builders are shipping</small></span><ArrowUpRight size={16} /></Link>
            <Link to="/colleges" className="card ecosystem-card"><span className="ecosystem-icon"><Trophy size={19} /></span><span><strong>College rankings</strong><small>Compare quality-weighted outcomes</small></span><ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <ShowcaseSection />
      <LeaderboardSection />
      <SearchSection />
      <ContactSection />
    </>
  );
}
