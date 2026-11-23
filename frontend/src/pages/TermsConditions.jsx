export default function TermsConditions() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '760px' }}>
        <span className="eyebrow">Legal</span>
        <h1 style={{ margin: '0.75rem 0 0.5rem' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-faint)', marginBottom: '2rem' }}>Last updated: September 2026</p>

        <div className="legal-body">
          <p>
            These terms cover use of SkillBridge by clients, students, teams, and colleges. This is placeholder terms
            text for the current build and should be reviewed by qualified legal counsel before launch.
          </p>

          <h3>Accounts</h3>
          <p>You're responsible for the accuracy of the information you submit during registration and verification, and for keeping your login credentials secure.</p>

          <h3>Projects and agreements</h3>
          <p>Project requirements, budgets, timelines, and milestones agreed through the platform form the basis of the working relationship between a client and a provider. Both sides are expected to act on the terms shown in the generated project agreement.</p>

          <h3>Verification and ratings</h3>
          <p>Verification status, performance scores, and badges are calculated from platform activity and are shown publicly as part of each profile. Attempting to manipulate ratings or verification is not permitted.</p>

          <h3>Payments</h3>
          <p>Payment and settlement terms follow what's agreed in each project's agreement. A full payment gateway integration is planned for a later build.</p>

          <h3>Changes to these terms</h3>
          <p>We may update these terms as the platform evolves; continued use after an update means you accept the revised terms.</p>

          <h3>Contact</h3>
          <p>Questions about these terms can be sent to legal@skillbridge.example (placeholder contact for this build).</p>
        </div>
      </div>
    </section>
  );
}
