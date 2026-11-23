import { useState } from 'react';
import { studentProfiles } from '../../data/mockData';
import StudentCard from '../StudentCard';
import EmptyState from '../EmptyState';
import InviteModal from '../InviteModal';
import { useToast } from '../../context/ToastContext';

export default function SearchSection() {
  const [form, setForm] = useState({ name: '', id: '', skills: '', college: '' });
  const [results, setResults] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState('');
  const { showToast } = useToast();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const runSearch = (e) => {
    e.preventDefault();
    const filtered = studentProfiles.filter((student) => {
      const matchesName = !form.name || student.name.toLowerCase().includes(form.name.toLowerCase());
      const matchesId = !form.id || student.studentId.toLowerCase().includes(form.id.toLowerCase());
      const matchesSkills = !form.skills || student.skills.toLowerCase().includes(form.skills.toLowerCase());
      const matchesCollege = !form.college || student.college.toLowerCase().includes(form.college.toLowerCase());
      return matchesName && matchesId && matchesSkills && matchesCollege;
    });
    setResults(filtered);
  };

  const openInvite = (name) => {
    setInviteTarget(name);
    setInviteOpen(true);
  };

  return (
    <section className="section" id="search">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Smart Search</span>
          <h2>Find verified student developers</h2>
          <p>Filter by name, student ID, skills, or college to find the right developer for your project.</p>
        </div>

        <form className="card" onSubmit={runSearch}>
          <div className="search-filters">
            <div className="field-group">
              <label>Developer name</label>
              <input value={form.name} onChange={update('name')} placeholder="Enter developer name" />
            </div>
            <div className="field-group">
              <label>Student ID</label>
              <input value={form.id} onChange={update('id')} placeholder="Enter student ID" />
            </div>
            <div className="field-group">
              <label>Skills</label>
              <input value={form.skills} onChange={update('skills')} placeholder="JavaScript, Django, React" />
            </div>
            <div className="field-group">
              <label>College</label>
              <input value={form.college} onChange={update('college')} placeholder="Enter college name" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Search Developers</button>
        </form>

        {results && (
          results.length ? (
            <div className="developer-results-grid">
              {results.map((student, i) => (
                <StudentCard key={student.studentId} student={student} onInvite={openInvite} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ marginTop: '2rem' }}>
              <EmptyState title="No students match your search criteria" description="Try broadening your filters." />
            </div>
          )
        )}
      </div>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        defaultName={inviteTarget}
        onSend={() => showToast('Invitation sent')}
      />
    </section>
  );
}
