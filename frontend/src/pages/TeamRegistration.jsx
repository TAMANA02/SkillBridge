import { ArrowLeft, ArrowRight, CheckCircle2, Github, Globe, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { teamService } from '../services/teamService';

const steps = ['Team identity', 'Members', 'Capabilities', 'Portfolio'];
const initialMember = { name: '', role: '', email: '' };

export default function TeamRegistration() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', college: '', description: '', leader: '', skills: '', availability: 'Taking new projects', website: '', github: '', members: [{ ...initialMember }] });
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateMember = (index, field, value) => setForm((current) => ({ ...current, members: current.members.map((member, memberIndex) => memberIndex === index ? { ...member, [field]: value } : member) }));
  const addMember = () => update('members', [...form.members, { ...initialMember }]);
  const removeMember = (index) => update('members', form.members.filter((_, memberIndex) => memberIndex !== index));
  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const previous = () => setStep((current) => Math.max(current - 1, 0));
  const submit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) { showToast('Sign in before submitting a team for verification'); return; }
    const payload = {
      name: form.name,
      college: form.college,
      description: form.description,
      skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      availability: form.availability === 'Available next month' ? 'next_month' : form.availability === 'Currently at capacity' ? 'at_capacity' : 'taking_projects',
      website_url: form.website || null,
      github_url: form.github || null,
      members: form.members.map((member) => ({ name: member.name, role: member.role, email: member.email })),
    };
    try {
      const { data } = await teamService.register(payload);
      showToast('Team profile submitted for verification');
      navigate(`/teams/${data.slug}`);
    } catch (error) {
      const apiError = error.response?.data;
      const message = apiError?.detail || apiError?.members?.[0] || 'Team registration could not be submitted';
      showToast(typeof message === 'string' ? message : 'Please review the team details');
    }
  };

  return <main className="registration-page"><div className="container registration-shell"><Link to="/teams" className="back-link"><ArrowLeft size={15} /> Back to teams</Link><div className="registration-heading"><div><span className="eyebrow">Team registration</span><h1>Put your best collaboration forward.</h1><p>Create a team profile that helps clients understand who you are, what you build, and how you work together.</p></div><div className="registration-mark"><Users size={28} /><span>Team<br />profile</span></div></div><div className="registration-progress">{steps.map((item, index) => <div className={`progress-step ${index <= step ? 'active' : ''}`} key={item}><span>{index < step ? <CheckCircle2 size={14} /> : index + 1}</span><small>{item}</small></div>)}</div><form className="registration-card card" onSubmit={submit}>{step === 0 && <StepIdentity form={form} update={update} />}{step === 1 && <StepMembers form={form} updateMember={updateMember} addMember={addMember} removeMember={removeMember} />}{step === 2 && <StepCapabilities form={form} update={update} />}{step === 3 && <StepPortfolio form={form} update={update} />}<div className="registration-actions">{step > 0 ? <button type="button" className="btn btn-outline" onClick={previous}><ArrowLeft size={15} /> Previous</button> : <span />}{step < steps.length - 1 ? <button type="button" className="btn btn-primary" onClick={next}>Continue <ArrowRight size={15} /></button> : <button type="submit" className="btn btn-primary">Submit for verification <CheckCircle2 size={15} /></button>}</div></form></div></main>;
}

function StepIdentity({ form, update }) { return <div className="form-step"><span className="step-kicker">01 · The basics</span><h2>Give your team a clear point of view.</h2><p className="step-intro">This is the first thing a client will see when they discover your team.</p><div className="form-grid"><label>Team name<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Team Nova" /></label><label>Team leader<input required value={form.leader} onChange={(event) => update('leader', event.target.value)} placeholder="Full name" /></label><label>College or university<input required value={form.college} onChange={(event) => update('college', event.target.value)} placeholder="e.g. IIT Delhi" /></label><label>Availability<select value={form.availability} onChange={(event) => update('availability', event.target.value)}><option>Taking new projects</option><option>Available next month</option><option>Currently at capacity</option></select></label><label className="full-field">Team description<textarea required rows="5" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="What does your team do best?" /></label></div></div>; }

function StepMembers({ form, updateMember, addMember, removeMember }) { return <div className="form-step"><span className="step-kicker">02 · The people</span><h2>Introduce the people behind the work.</h2><p className="step-intro">Add your core team members. You can invite more people after the profile is approved.</p><div className="member-form-list">{form.members.map((member, index) => <div className="member-form-row" key={`member-${index}`}><span className="member-number">{index + 1}</span><input required value={member.name} onChange={(event) => updateMember(index, 'name', event.target.value)} placeholder="Member name" aria-label={`Member ${index + 1} name`} /><input required value={member.role} onChange={(event) => updateMember(index, 'role', event.target.value)} placeholder="Role or specialty" aria-label={`Member ${index + 1} role`} /><input type="email" value={member.email} onChange={(event) => updateMember(index, 'email', event.target.value)} placeholder="Email (optional)" aria-label={`Member ${index + 1} email`} />{form.members.length > 1 && <button type="button" className="icon-button danger-button" onClick={() => removeMember(index)} aria-label="Remove member"><Trash2 size={16} /></button>}</div>)}</div><button type="button" className="btn btn-ghost add-member-button" onClick={addMember}><Plus size={16} /> Add another member</button></div>; }

function StepCapabilities({ form, update }) { return <div className="form-step"><span className="step-kicker">03 · Your edge</span><h2>Make your capabilities easy to scan.</h2><p className="step-intro">Use simple terms clients might search for when they need a team like yours.</p><div className="form-grid"><label className="full-field">Skills and technologies<input required value={form.skills} onChange={(event) => update('skills', event.target.value)} placeholder="React, Node.js, Figma, PostgreSQL" /><small>Separate skills with commas.</small></label><div className="capability-preview full-field"><span className="eyebrow">Preview</span><div className="chip-row">{(form.skills || 'Your skills will appear here').split(',').map((skill) => <span className="skill-chip" key={skill}>{skill.trim()}</span>)}</div></div></div></div>; }

function StepPortfolio({ form, update }) { return <div className="form-step"><span className="step-kicker">04 · Your proof</span><h2>Point clients to your best work.</h2><p className="step-intro">Links are optional, but a visible portfolio helps your team earn trust faster.</p><div className="form-grid"><label><Github size={15} /> GitHub organization<input value={form.github} onChange={(event) => update('github', event.target.value)} placeholder="github.com/your-team" /></label><label><Globe size={15} /> Team website<input value={form.website} onChange={(event) => update('website', event.target.value)} placeholder="yourteam.dev" /></label></div><div className="registration-summary"><div className="avatar avatar-large">{form.name ? form.name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase() : 'SB'}</div><div><span className="badge-pill">Ready for review</span><h3>{form.name || 'Your team name'}</h3><p>{form.college || 'Your college'} · led by {form.leader || 'your team leader'}</p><div className="chip-row compact-chip-row">{(form.skills || 'Add skills').split(',').map((skill) => <span className="chip" key={skill}>{skill.trim()}</span>)}</div></div></div></div>; }
