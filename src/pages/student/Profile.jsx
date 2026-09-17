import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { studentService } from '../../services/studentService';
import api from '../../services/api';
import { firstErrorMessage } from '../../utils/formErrors';

export default function StudentProfileEdit() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [studentId, setStudentId] = useState(null);
  const [form, setForm] = useState({
    fullName: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '',
    professionalTitle: '',
    skills: '',
    college: '',
    universityName: '',
    course: '',
    branch: '',
    languagesKnown: [],
    bio: '',
    availability: '',
    resume: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    studentService
      .getMe()
      .then(({ data }) => {
        if (!active) return;
        setStudentId(data.id);
        setForm((f) => ({
          ...f,
          fullName: data.user ? `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() : f.fullName,
          professionalTitle: data.headline || '',
          skills: (data.skills || []).join(', '),
          college: data.college_name || '',
          universityName: data.university_name || '',
          course: data.course || '',
          branch: data.branch || '',
          languagesKnown: data.languages_known || [],
          bio: data.bio || '',
          availability: data.availability || '',
          resume: data.resume || '',
        }));
      })
      .catch(() => {
        // No backend / no student profile yet in this environment — the
        // form still works, it just starts blank instead of pre-filled.
      });
    return () => {
      active = false;
    };
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectResume = (event) => {
    const file = event.target.files?.[0] || null;
    setResumeError('');
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setResumeFile(null);
      setResumeError('Resume must be a PDF file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeFile(null);
      setResumeError('Resume must be smaller than 5 MB.');
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) {
      showToast('Could not find your student profile to update.');
      return;
    }
    setLoading(true);
    try {
      await studentService.updateMe(studentId, {
        headline: form.professionalTitle,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        university_name: form.universityName,
        course: form.course,
        branch: form.branch,
        languages_known: form.languagesKnown,
        bio: form.bio,
        availability: form.availability,
      });
      if (resumeFile) {
        const payload = new FormData();
        payload.append('resume', resumeFile);
        const { data } = await studentService.updateMe(studentId, payload);
        setForm((current) => ({ ...current, resume: data.resume || current.resume }));
        setResumeFile(null);
      }
      showToast('Profile updated');
    } catch (error) {
      showToast(firstErrorMessage(error?.response?.data, 'Could not save your profile right now.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Your profile</span>
          <h2>Student Profile</h2>
          <p>Keep your profile current and client-ready.</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: '680px' }}>
        <div className="field-grid">
          <div className="field-group full">
            <label>Full Name</label>
            <input value={form.fullName} onChange={update('fullName')} placeholder="Full Name" disabled />
          </div>
          <div className="field-group full">
            <label>Professional Title</label>
            <input value={form.professionalTitle} onChange={update('professionalTitle')} placeholder="Professional Title" />
          </div>
          <div className="field-group full">
            <label>Skills</label>
            <input value={form.skills} onChange={update('skills')} placeholder="React, Node.js, UI/UX" />
          </div>
          <div className="field-group full">
            <label>College</label>
            <input value={form.college} placeholder="College" disabled />
          </div>
          <div className="field-group full">
            <label>University Name</label>
            <input value={form.universityName} onChange={update('universityName')} placeholder="University or institute name" />
          </div>
          <div className="field-group full">
            <label>Course</label>
            <input value={form.course} onChange={update('course')} placeholder="Computer Science / IT course" />
          </div>
          <div className="field-group full">
            <label>Branch / Specialization</label>
            <input value={form.branch} onChange={update('branch')} placeholder="CS/IT specialization" />
          </div>
          <div className="field-group full">
            <label>Languages Known</label>
            <select value={form.languagesKnown[0] || ''} onChange={(event) => setForm((current) => ({ ...current, languagesKnown: event.target.value ? [event.target.value] : [] }))}>
              <option value="">Select languages</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Both Hindi & English">Both Hindi & English</option>
            </select>
          </div>
          <div className="field-group full">
            <label>Availability</label>
            <input value={form.availability} onChange={update('availability')} placeholder="e.g. Available now" />
          </div>
          <div className="field-group full">
            <label>Bio</label>
            <textarea rows={5} value={form.bio} onChange={update('bio')} placeholder="Bio" />
          </div>
          <div className="field-group full">
            <label>Resume (PDF)</label>
            <input type="file" accept="application/pdf" onChange={selectResume} />
            {resumeError && <div className="field-error">{resumeError}</div>}
            {form.resume && <a href={form.resume.startsWith('http') ? form.resume : `${api.defaults.baseURL.replace(/\/api\/?$/, '')}${form.resume}`} target="_blank" rel="noreferrer">View current resume</a>}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving\u2026' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  );
}
