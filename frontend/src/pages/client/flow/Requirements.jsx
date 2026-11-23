import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import FlowStepper from '../../../components/flow/FlowStepper';
import VoiceInput from '../../../components/flow/VoiceInput';
import RecommendationControl from '../../../components/flow/RecommendationControl';
import { useProjectFlow } from '../../../context/ProjectFlowContext';
import { FRONTEND_OPTIONS, BACKEND_OPTIONS, DATABASE_OPTIONS, UI_STYLE_OPTIONS, LAYOUT_OPTIONS } from '../../../data/flowTemplates';
import { recommendRequirement } from '../../../utils/requirementRecommendations';

const STEPS = ['Describe', 'Clarify', 'Requirements', 'Budget', 'Review'];
const CATEGORIES = ['Web Development', 'Frontend Development', 'Backend Development', 'Full Stack Development', 'Mobile App Development', 'Android Development', 'iOS Development', 'Software Development', 'Python Development', 'Django Development', 'Java Development', 'Node.js Development', 'React Development', 'JavaScript Development', 'TypeScript Development', 'AI/ML', 'Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Generative AI', 'LLM Development', 'Chatbot Development', 'NLP', 'Computer Vision', 'Data Science', 'Data Analytics', 'Data Engineering', 'Database Development', 'PostgreSQL', 'SQL', 'Cloud Computing', 'AWS', 'Microsoft Azure', 'Google Cloud', 'DevOps', 'Docker', 'Cybersecurity', 'Ethical Security', 'UI/UX Design', 'Graphic Design', 'Logo Design', 'Video Editing', 'Animation', '3D Design', 'Content Writing', 'Copywriting', 'Digital Marketing', 'SEO', 'Social Media Marketing', 'E-commerce', 'WordPress', 'Shopify', 'API Development', 'Automation', 'Blockchain', 'IoT', 'Game Development', 'Testing & QA', 'Software Testing', 'Business & Consulting', 'Research & Development', 'Other'];
const THEMES = ['Light', 'Dark', 'Modern', 'Minimal', 'Professional', 'Glassmorphism', 'Premium', 'Custom'];
const TYPOGRAPHY = ['Clean sans-serif', 'Humanist sans-serif', 'Editorial serif + sans-serif', 'Modern geometric sans-serif'];

function toggle(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function appendVoice(current, transcript) {
  return current ? `${current} ${transcript}` : transcript;
}

function VoiceField({ label, value, onChange, placeholder, rows = 3 }) {
  const handleResult = useCallback((transcript) => onChange(appendVoice(value, transcript)), [onChange, value]);
  return (
    <div className="voice-field">
      <div className="voice-field-input">
        <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={label} />
        <VoiceInput onResult={handleResult} label={`Speak ${label.toLowerCase()}`} />
      </div>
    </div>
  );
}

function Recommendation({ kind, req, onUse }) {
  const context = useMemo(() => ({
    title: req.title,
    description: req.description,
    functional: req.functional,
    theme: req.design.theme,
    branding: req.design.branding,
  }), [req]);
  return <RecommendationControl kind={kind} context={context} onUse={onUse} getRecommendation={recommendRequirement} />;
}

export default function Requirements() {
  const { draft, updateDraft } = useProjectFlow();
  const navigate = useNavigate();
  const req = draft.requirements;
  const setReq = (patch) => updateDraft({ requirements: { ...req, ...patch } });
  const setDesign = (patch) => setReq({ design: { ...req.design, ...patch } });
  const canContinue = Boolean(req.title.trim() && req.description.trim() && req.category);
  const context = { title: req.title, description: req.description, functional: req.functional, theme: req.design.theme, branding: req.design.branding };
  const useTechnology = (kind, value) => setReq({ [kind]: value ? [value] : [] });

  return (
    <div className="flow-shell">
      <FlowStepper steps={STEPS} currentIndex={2} />
      <div className="dashboard-header">
        <div><span className="eyebrow">Project requirements</span><h2>Tell us the full picture</h2><p>This becomes the structured requirement packet developers will be matched against.</p></div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="step-panel-title">Project information</h3>
        <div className="field-grid">
          <div className="field-group full"><label htmlFor="project-title">Project Title</label><input id="project-title" value={req.title} onChange={(event) => setReq({ title: event.target.value })} placeholder="Enter your actual project title" /></div>
          <div className="field-group"><label>Category</label><select value={req.category} onChange={(event) => setReq({ category: event.target.value })}><option value="">Select category</option>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>
          <div className="field-group"><label>Type of website/application</label><input value={req.appType} onChange={(event) => setReq({ appType: event.target.value })} placeholder="e.g. Web app, PWA, internal tool" /></div>
          <div className="field-group full"><label>Project Description</label><VoiceField label="Project Description" value={req.description} onChange={(value) => setReq({ description: value })} placeholder="Describe the goal of this project" rows={4} /></div>
          <div className="field-group full"><label>Pages Required</label><input value={req.pages} onChange={(event) => setReq({ pages: event.target.value })} placeholder="Home, Login, Dashboard, Attendance, Admin" /><Recommendation kind="pages" req={req} onUse={(value) => setReq({ pages: value })} /></div>
          <div className="field-group full"><label>Functional Requirements</label><VoiceField label="Functional Requirements" value={req.functional} onChange={(value) => setReq({ functional: value })} placeholder="What should the system do, step by step?" /><Recommendation kind="functional" req={req} onUse={(value) => setReq({ functional: value })} /></div>
          <div className="field-group full"><label>Technical Requirements</label><VoiceField label="Technical Requirements" value={req.technical} onChange={(value) => setReq({ technical: value })} placeholder="Hosting, integrations, performance needs" /><Recommendation kind="technical" req={req} onUse={(value) => setReq({ technical: value })} /></div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="step-panel-title">Frontend, backend & database</h3>
        {[["frontend", 'Frontend', FRONTEND_OPTIONS], ["backend", 'Backend', BACKEND_OPTIONS], ["database", 'Database', DATABASE_OPTIONS]].map(([kind, label, options]) => (
          <div className="field-group full" key={kind}>
            <label>{label}</label>
            <div className="chip-row">
              {options.map((option) => <button key={option} type="button" className={`chip ${req[kind].includes(option) ? 'active' : ''}`} onClick={() => setReq({ [kind]: toggle(req[kind], option) })}>{option}</button>)}
              <RecommendationControl kind={kind} context={context} onUse={(value) => useTechnology(kind, value)} getRecommendation={recommendRequirement} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="step-panel-title">Design preferences</h3>
        <div className="field-grid">
          <div className="field-group"><label>Preferred Theme</label><select value={req.design.theme} onChange={(event) => setDesign({ theme: event.target.value })}><option value="">Select a theme</option>{THEMES.map((theme) => <option key={theme}>{theme}</option>)}</select><RecommendationControl kind="theme" context={context} onUse={(value) => setDesign({ theme: value })} getRecommendation={recommendRequirement} /></div>
          <div className="field-group"><label>UI style</label><select value={req.design.uiStyle} onChange={(event) => setDesign({ uiStyle: event.target.value })}><option value="">Select a style</option>{UI_STYLE_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></div>
          <div className="field-group"><label>Layout preference</label><select value={req.design.layout} onChange={(event) => setDesign({ layout: event.target.value })}><option value="">Select a layout</option>{LAYOUT_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></div>
          <div className="field-group"><label>Color preferences</label><input value={req.design.colors} onChange={(event) => setDesign({ colors: event.target.value })} placeholder="e.g. dark navy with a gold accent" /><RecommendationControl kind="colors" context={context} onUse={(value) => setDesign({ colors: value })} getRecommendation={recommendRequirement} /></div>
          <div className="field-group"><label>Typography preferences</label><select value={req.design.typography} onChange={(event) => setDesign({ typography: event.target.value })}><option value="">Select typography</option>{TYPOGRAPHY.map((option) => <option key={option}>{option}</option>)}</select><RecommendationControl kind="typography" context={context} onUse={(value) => setDesign({ typography: value })} getRecommendation={recommendRequirement} /></div>
          <div className="field-group"><label>Reference Website <span className="optional-label">Optional</span></label><input type="url" value={req.design.referenceUrl} onChange={(event) => setDesign({ referenceUrl: event.target.value })} placeholder="https://example.com" /></div>
          <div className="field-group"><label>Light or dark theme</label><div className="chip-row">{['light', 'dark', 'both'].map((mode) => <button key={mode} type="button" className={`chip ${req.design.mode === mode ? 'active' : ''}`} onClick={() => setDesign({ mode })}>{mode}</button>)}</div></div>
          <div className="field-group"><label>Branding requirements</label><input value={req.design.branding} onChange={(event) => setDesign({ branding: event.target.value })} placeholder="Logo, brand colors, tone" /><RecommendationControl kind="branding" context={context} onUse={(value) => setDesign({ branding: value })} getRecommendation={recommendRequirement} /></div>
          <div className="field-group full"><label>Special design instructions</label><textarea rows={2} value={req.design.special} onChange={(event) => setDesign({ special: event.target.value })} placeholder="Anything else about how it should look and feel" /></div>
        </div>
      </div>

      <div className="form-actions"><button type="button" className="btn btn-muted" onClick={() => navigate('/client/new-project/clarify')}>Back</button><button type="button" className="btn btn-primary" disabled={!canContinue} onClick={() => navigate('/client/new-project/budget')}>Continue to budget & timeline</button></div>
    </div>
  );
}
