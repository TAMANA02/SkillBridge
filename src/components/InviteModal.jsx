import { useState } from 'react';
import Modal from './Modal';

const emptyInvite = {
  developerName: '', projectTitle: '', projectCategory: '', budget: '', deadline: '', skills: '', message: '',
};

export default function InviteModal({ open, onClose, defaultName = '', onSend }) {
  const [form, setForm] = useState({ ...emptyInvite, developerName: defaultName });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend?.({
      developerName: form.developerName || 'Developer',
      projectTitle: form.projectTitle || 'Untitled project',
      projectCategory: form.projectCategory || 'General',
      budget: form.budget || 'Not specified',
      deadline: form.deadline || 'No deadline',
      skills: form.skills || 'Not specified',
      message: form.message || 'No personal message provided.',
    });
    setForm(emptyInvite);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} eyebrow="Send Invitation" title="Invite developer to a project">
      <form onSubmit={handleSubmit}>
        <div className="field-grid">
          <div className="field-group full">
            <label>Developer name</label>
            <input value={form.developerName} onChange={update('developerName')} placeholder="Developer name" />
          </div>
          <div className="field-group">
            <label>Project title</label>
            <input value={form.projectTitle} onChange={update('projectTitle')} placeholder="Project title" />
          </div>
          <div className="field-group">
            <label>Category</label>
            <input value={form.projectCategory} onChange={update('projectCategory')} placeholder="e.g. Frontend" />
          </div>
          <div className="field-group">
            <label>Budget</label>
            <input value={form.budget} onChange={update('budget')} placeholder="e.g. \u20b930k - \u20b945k" />
          </div>
          <div className="field-group">
            <label>Deadline</label>
            <input type="date" value={form.deadline} onChange={update('deadline')} />
          </div>
          <div className="field-group full">
            <label>Skills needed</label>
            <input value={form.skills} onChange={update('skills')} placeholder="React, Node.js" />
          </div>
          <div className="field-group full">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={update('description')} placeholder="Describe the work" />
          </div>
          <div className="field-group full">
            <label>Personal message</label>
            <textarea rows={3} value={form.message} onChange={update('message')} placeholder="Add a personal note" />
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Send Invitation</button>
        </div>
      </form>
    </Modal>
  );
}
