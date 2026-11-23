import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't do the browser's native "jump to #anchor" behavior on
// navigation, so links like <Link to="/#showcase"> just changed the URL
// without ever scrolling anywhere. This watches the location and scrolls to
// the matching element whenever the hash changes (including landing on a
// hash directly, and navigating from a different page to "/#id").
export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    // Wait a tick for the target route's content to render before measuring.
    const id = window.setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(id);
  }, [hash, pathname]);

  return null;
}
