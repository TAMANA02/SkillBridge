import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Mic, Info } from 'lucide-react';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';
import VoiceHelpModal from './VoiceHelpModal';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Find Talent', to: '/discover' },
  { label: 'Teams', to: '/teams' },
  { label: 'Feed', to: '/feed' },
  { label: 'Colleges', to: '/colleges' },
  { label: 'Services', to: '/services' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { listening, toggleListening, supported } = useVoiceNavigation();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (to) => {
    setMenuOpen(false);
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      if (path === '' || path === '/') {
        navigate('/');
        window.setTimeout(() => document.querySelector(`#${hash}`)?.scrollIntoView({ behavior: 'smooth' }), 120);
      }
    }
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">SB</span>
            <div className="brand-copy">
              <strong>SkillBridge</strong>
              <span>Build • Learn • Grow</span>
            </div>
          </Link>

          <button
            className={`nav-toggle ${menuOpen ? 'active' : ''}`}
            aria-label="Open navigation"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>

          <nav className={`nav-menu ${menuOpen ? 'active' : ''}`} id="navMenu">
            {NAV_LINKS.map((link) => (
              link.to.includes('#') ? (
                <a key={link.label} href={link.to} className="nav-link" onClick={(e) => { e.preventDefault(); handleNavClick(link.to); }}>
                  {link.label}
                </a>
              ) : (
                <NavLink key={link.label} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </NavLink>
              )
            ))}
            {isAuthenticated ? (
              <NavLink to={user?.role === 'client' ? '/client/dashboard' : '/student/dashboard'} className="nav-link nav-login" onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>
            ) : (
              <NavLink to="/login" className="nav-link nav-login" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            )}
          </nav>

          <div className="nav-actions">
            <button className="icon-button" aria-label="Open search panel" onClick={() => handleNavClick('/#search')}>
              <Search size={17} />
            </button>
            <button
              className={`icon-button voice-button ${listening ? 'voice-active' : ''}`}
              aria-label="Voice Navigation"
              title={supported ? 'Voice Navigation' : 'Voice navigation not supported in this browser'}
              onClick={toggleListening}
            >
              <Mic size={17} />
            </button>
            <button className="icon-button" aria-label="Voice Commands" title="Voice Commands" onClick={() => setHelpOpen(true)}>
              <Info size={17} />
            </button>
          </div>
        </div>
      </header>

      <VoiceHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
