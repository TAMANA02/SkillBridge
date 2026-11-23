export default function PrivacyPolicy() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '760px' }}>
        <span className="eyebrow">Legal</span>
        <h1 style={{ margin: '0.75rem 0 0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-faint)', marginBottom: '2rem' }}>Last updated: September 2026</p>

        <div className="legal-body">
          <p>
            This page explains what information SkillBridge collects when you use the platform as a client, student,
            team, or college, and how that information is used. This is placeholder policy text for the current build
            and should be reviewed by qualified legal counsel before the platform handles real user data in production.
          </p>

          <h3>Information we collect</h3>
          <p>Account details you provide during registration (name, email, phone, college, skills, business information), content you post (projects, portfolio items, feed updates, messages), and usage data such as pages visited and actions taken on the platform.</p>

          <h3>How we use it</h3>
          <p>To operate your account and dashboard, match clients with students, teams, and colleges, verify student and college submissions, and improve the matching and performance systems described in the product.</p>

          <h3>Sharing</h3>
          <p>Public profile information (skills, ratings, completed projects, badges) is visible to other users by design, since that's how the matching and hiring flow works. We don't sell personal data to third parties.</p>

          <h3>Your choices</h3>
          <p>You can update or remove your profile information from your dashboard at any time, and can contact us to request account deletion.</p>

          <h3>Contact</h3>
          <p>Questions about this policy can be sent to privacy@skillbridge.example (placeholder contact for this build).</p>
        </div>
      </div>
    </section>
  );
}
