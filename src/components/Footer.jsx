import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand" style={{ marginBottom: '1rem' }}>
              <span className="brand-mark">SB</span>
              <div className="brand-copy">
                <strong>SkillBridge</strong>
                <span>Build • Learn • Grow</span>
              </div>
            </div>
            <p style={{ maxWidth: '32ch' }}>
              Connecting verified college student developers with clients for real-world digital projects.
            </p>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <Link to="/services">Services</Link>
            <Link to="/#about">About</Link>
            <Link to="/#showcase">Project Showcase</Link>
            <Link to="/#leaderboard">Hall of Fame</Link>
          </div>
          <div className="footer-col">
            <h5>For People</h5>
            <Link to="/signup?role=student">For Students</Link>
            <Link to="/signup?role=client">For Clients</Link>
            <Link to="/login">Login</Link>
            <Link to="/ai-project-completion">AI Project Completion</Link>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <Link to="/#contact">Contact</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms & Conditions</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SkillBridge. All rights reserved.</span>
          <div className="footer-socials">
            <a className="icon-button" href="#github" aria-label="GitHub"><Github size={16} /></a>
            <a className="icon-button" href="#linkedin" aria-label="LinkedIn"><Linkedin size={16} /></a>
            <a className="icon-button" href="#twitter" aria-label="Twitter"><Twitter size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
