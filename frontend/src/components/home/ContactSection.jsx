import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { showToast } = useToast();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    showToast('Message sent. We will be in touch soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="section section-alt" id="contact">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Contact</span>
          <h2>Let's talk about your project</h2>
          <p>Reach out for project requests, support, or partnership opportunities.</p>
        </div>
        <form className="card" style={{ maxWidth: '640px', margin: '0 auto' }} onSubmit={submit}>
          <div className="field-grid">
            <div className="field-group">
              <label>Name</label>
              <input value={form.name} onChange={update('name')} placeholder="Your full name" required />
            </div>
            <div className="field-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
            </div>
            <div className="field-group full">
              <label>Subject</label>
              <input value={form.subject} onChange={update('subject')} placeholder="Project request, support, or partnership" />
            </div>
            <div className="field-group full">
              <label>Message</label>
              <textarea rows={5} value={form.message} onChange={update('message')} placeholder="Tell us more about your project." required />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block">Send Message</button>
          </div>
        </form>
      </div>
    </section>
  );
}
