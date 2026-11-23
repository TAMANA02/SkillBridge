import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import StudentWizard from '../components/signup/StudentWizard';
import ClientWizard from '../components/signup/ClientWizard';

export default function Signup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'client' ? 'client' : searchParams.get('role') === 'student' ? 'student' : null;
  const [role, setRole] = useState(initialRole);

  const chooseRole = (value) => {
    setRole(value);
    setSearchParams({ role: value });
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="brand" style={{ position: 'relative' }}>
          <span className="brand-mark">SB</span>
          <div className="brand-copy">
            <strong style={{ fontSize: '1.1rem' }}>SkillBridge</strong>
            <span>Build • Learn • Grow</span>
          </div>
        </div>
        <p className="auth-visual-quote">
          "Join as a student to build your portfolio, or as a client to hire verified student talent."
        </p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-card" style={{ width: role ? 'min(720px, 100%)' : 'min(440px, 100%)' }}>
          <span className="eyebrow">Get started</span>
          <h1>Create your account</h1>
          <p className="subtitle">Join as a student or as a client.</p>

          <div className="role-toggle" style={{ marginBottom: role ? '1.75rem' : 0 }}>
            <div className={`role-option ${role === 'student' ? 'selected' : ''}`} onClick={() => chooseRole('student')}>
              <strong>Student</strong>
              <span>Create a verified student profile</span>
            </div>
            <div className={`role-option ${role === 'client' ? 'selected' : ''}`} onClick={() => chooseRole('client')}>
              <strong>Client</strong>
              <span>Register your business</span>
            </div>
          </div>

          {role === 'student' && <StudentWizard />}
          {role === 'client' && <ClientWizard />}

          <p className="auth-switch">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}