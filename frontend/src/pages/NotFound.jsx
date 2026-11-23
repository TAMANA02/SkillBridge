import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="container">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>404</span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '1rem 0' }}>Page not found</h1>
        <p style={{ margin: '0 auto 2rem', maxWidth: '40ch' }}>
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </div>
    </section>
  );
}
