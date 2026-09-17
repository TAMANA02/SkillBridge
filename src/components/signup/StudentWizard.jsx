import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import StepWizard from './StepWizard';
import Field from './Field';
import { useAuth } from '../../context/AuthContext';
import { firstErrorMessage } from '../../utils/formErrors';

const TOTAL_STEPS = 8;

const COURSES = [
  'B.Tech / B.E. Computer Science & Engineering',
  'B.Tech / B.E. Information Technology',
  'B.Tech Artificial Intelligence',
  'B.Tech Artificial Intelligence & Machine Learning',
  'B.Tech Data Science',
  'B.Tech Computer Science & AI',
  'B.Tech Computer Science & Engineering (AI/ML)',
  'BCA',
  'MCA',
  'B.Sc Computer Science',
  'B.Sc Information Technology',
  'Diploma in Computer Science',
  'Diploma in Information Technology',
  'PGDCA',
  'Other Computer Science / IT course',
];

const BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence',
  'Artificial Intelligence & Machine Learning',
  'Data Science',
  'Computer Science & AI',
  'Computer Science & Data Science',
  'Software Engineering',
  'Cyber Security',
  'Information Security',
  'Cloud Computing',
  'Internet of Things (IoT)',
  'Computer Applications',
  'Other CS/IT-related specialization',
];

const BRANCH_OPTIONAL_COURSES = new Set(['BCA', 'MCA', 'PGDCA', 'Diploma in Computer Science', 'Diploma in Information Technology']);

const STEP_REQUIRED_FIELDS = {
  1: ['fullName', 'email', 'mobile', 'dob', 'gender', 'address', 'city', 'state', 'country'],
  2: ['collegeName', 'studentId', 'course', 'currentYear', 'graduationYear'],
  3: ['professionalTitle', 'shortBio', 'careerObjective', 'skillsInput', 'techStack', 'languagesKnown'],
  4: [],
  5: ['resumeUpload'],
  6: [],
  7: ['githubLink', 'linkedinLink'],
  8: ['password', 'confirmPassword', 'termsCheck', 'privacyCheck'],
};

export default function StudentWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ gender: '', currentYear: '', resumeUpload: '' });
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateFile = (key) => (e) =>
  setForm((f) => ({
    ...f,
    [key]: e.target.files?.[0] || null,
  }));
  const updateCheck = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));

  const validateStep = () => {
    const required = STEP_REQUIRED_FIELDS[step].filter((field) => field !== 'branch' || !BRANCH_OPTIONAL_COURSES.has(form.course));
    const nextErrors = {};
    required.forEach((field) => {
      const value = form[field];
      if (!value) nextErrors[field] = 'This field is required.';
    });
    if (step === 2 && !BRANCH_OPTIONAL_COURSES.has(form.course) && !form.branch) {
      nextErrors.branch = 'This field is required.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      setMessage({ type: 'error', text: 'Please complete the required fields.' });
      return;
    }
    setMessage(null);
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }
    const { success, error } = await signup({ ...form, role: 'student', experience, projects });
    if (success) {
      setMessage({ type: 'success', text: 'Registration completed successfully.' });
      setTimeout(() => navigate('/student/dashboard'), 500);
    } else {
      setMessage({ type: 'error', text: firstErrorMessage(error) });
    }
  };

  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <StepWizard
      step={step}
      totalSteps={TOTAL_STEPS}
      onPrev={handlePrev}
      onNext={handleNext}
      message={message}
      nextLabel={loading ? 'Submitting\u2026' : undefined}
      nextDisabled={loading}
    >
      {step === 1 && (
        <>
          <p className="step-panel-title">Personal Information</p>
          <div className="field-grid">
            <Field label="Full Name" id="fullName" required value={form.fullName} onChange={update('fullName')} placeholder="Enter full name" error={errors.fullName} />
            <Field label="Email" id="email" type="email" required value={form.email} onChange={update('email')} placeholder="Enter email address" error={errors.email} />
            <Field label="Mobile" id="mobile" type="tel" required value={form.mobile} onChange={update('mobile')} placeholder="Enter mobile number" error={errors.mobile} />
            <Field label="Date of birth" id="dob" type="date" required value={form.dob} onChange={update('dob')} error={errors.dob} />
            <Field label="Gender" id="gender" type="select" required value={form.gender} onChange={update('gender')} options={['Male', 'Female', 'Other', 'Prefer not to say']} error={errors.gender} />
            <Field label="Street address" id="address" required value={form.address} onChange={update('address')} placeholder="Street address" error={errors.address} />
            <Field label="City" id="city" required value={form.city} onChange={update('city')} placeholder="Enter city" error={errors.city} />
            <Field label="State" id="state" required value={form.state} onChange={update('state')} placeholder="Enter state" error={errors.state} />
            <Field label="Country" id="country" required value={form.country} onChange={update('country')} placeholder="Enter country" error={errors.country} />
            <Field label="Profile photo" id="profilePhoto" type="file" accept="image/*" onChange={updateFile('profilePhoto')} />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="step-panel-title">Education Details</p>
          <div className="field-grid">
            <Field label="College name" id="collegeName" required value={form.collegeName} onChange={update('collegeName')} placeholder="Enter college name" error={errors.collegeName} />
            <Field label="Student ID" id="studentId" required value={form.studentId} onChange={update('studentId')} placeholder="Enter student ID" error={errors.studentId} />
            <Field label="Course" id="course" type="select" required value={form.course} onChange={update('course')} options={COURSES} error={errors.course} />
            <Field label="Branch / Specialization" id="branch" type="select" required={!BRANCH_OPTIONAL_COURSES.has(form.course)} value={form.branch} onChange={update('branch')} options={BRANCHES} error={errors.branch} />
            <Field label="Current year" id="currentYear" type="select" required value={form.currentYear} onChange={update('currentYear')} options={['First Year', 'Second Year', 'Third Year', 'Final Year']} error={errors.currentYear} />
            <Field label="Graduation year" id="graduationYear" required value={form.graduationYear} onChange={update('graduationYear')} placeholder="Enter graduation year" error={errors.graduationYear} />
            <Field label="College ID upload" id="collegeIdUpload" type="file" accept="image/*,application/pdf" onChange={updateFile('collegeIdUpload')} />
            <Field label="University name" id="universityName" value={form.universityName} onChange={update('universityName')} placeholder="Enter university name" full />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p className="step-panel-title">Professional Details</p>
          <div className="field-grid">
            <Field label="Professional title" id="professionalTitle" required full value={form.professionalTitle} onChange={update('professionalTitle')} placeholder="Full Stack Developer" error={errors.professionalTitle} />
            <Field label="Short bio" id="shortBio" type="textarea" required full value={form.shortBio} onChange={update('shortBio')} placeholder="Write a concise bio" error={errors.shortBio} />
            <Field label="Career objective" id="careerObjective" type="textarea" required full value={form.careerObjective} onChange={update('careerObjective')} placeholder="Share your career objective" error={errors.careerObjective} />
            <Field label="Skills" id="skillsInput" required value={form.skillsInput} onChange={update('skillsInput')} placeholder="HTML, CSS, JavaScript" error={errors.skillsInput} />
            <Field label="Tech stack" id="techStack" required value={form.techStack} onChange={update('techStack')} placeholder="React, Node.js, Django" error={errors.techStack} />
            <Field label="Languages known" id="languagesKnown" type="select" required value={form.languagesKnown} onChange={update('languagesKnown')} options={['Hindi', 'English', 'Both Hindi & English']} error={errors.languagesKnown} />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <p className="step-panel-title">Experience (optional)</p>
          <div className="repeatable-list">
            {experience.map((item, i) => (
              <div key={i} className="experience-entry">
                <div className="field-grid">
                  <div className="field-group">
                    <label>Role</label>
                    <input
                      value={item.role}
                      placeholder="Enter role"
                      onChange={(e) => setExperience((list) => list.map((it, idx) => idx === i ? { ...it, role: e.target.value } : it))}
                    />
                  </div>
                  <div className="field-group">
                    <label>Company</label>
                    <input
                      value={item.company}
                      placeholder="Enter company"
                      onChange={(e) => setExperience((list) => list.map((it, idx) => idx === i ? { ...it, company: e.target.value } : it))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setExperience((list) => [...list, { role: '', company: '' }])}>
            <Plus size={14} /> Add Another Experience
          </button>
        </>
      )}

      {step === 5 && (
        <>
          <p className="step-panel-title">Resume</p>
          <div className="field-grid">
            <Field label="Resume upload (PDF)" id="resumeUpload" type="file" accept="application/pdf" required full onChange={updateFile('resumeUpload')} error={errors.resumeUpload} />
          </div>
          <div className="resume-preview" style={{ marginTop: '0.75rem', color: 'var(--text-faint)', fontSize: '0.86rem' }}>
            {form.resumeUpload?.name || 'No resume uploaded yet.'}
          </div>
        </>
      )}

      {step === 6 && (
        <>
          <p className="step-panel-title">Projects (optional)</p>
          <div className="repeatable-list">
            {projects.map((item, i) => (
              <div key={i} className="project-entry">
                <div className="field-grid">
                  <div className="field-group">
                    <label>Project name</label>
                    <input
                      value={item.name}
                      placeholder="Enter project name"
                      onChange={(e) => setProjects((list) => list.map((it, idx) => idx === i ? { ...it, name: e.target.value } : it))}
                    />
                  </div>
                  <div className="field-group">
                    <label>Link</label>
                    <input
                      value={item.link}
                      placeholder="Project URL"
                      onChange={(e) => setProjects((list) => list.map((it, idx) => idx === i ? { ...it, link: e.target.value } : it))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setProjects((list) => [...list, { name: '', link: '' }])}>
            <Plus size={14} /> Add Another Project
          </button>
        </>
      )}

      {step === 7 && (
        <>
          <p className="step-panel-title">Social Links</p>
          <div className="field-grid">
            <Field label="GitHub" id="githubLink" type="url" required value={form.githubLink} onChange={update('githubLink')} placeholder="GitHub profile URL" error={errors.githubLink} />
            <Field label="LinkedIn" id="linkedinLink" type="url" required value={form.linkedinLink} onChange={update('linkedinLink')} placeholder="LinkedIn profile URL" error={errors.linkedinLink} />
            <Field label="Portfolio" id="portfolioLink" type="url" value={form.portfolioLink} onChange={update('portfolioLink')} placeholder="Portfolio website URL" />
            <Field label="Behance" id="behanceLink" type="url" value={form.behanceLink} onChange={update('behanceLink')} placeholder="Behance profile URL" />
            <Field label="Dribbble" id="dribbbleLink" type="url" value={form.dribbbleLink} onChange={update('dribbbleLink')} placeholder="Dribbble profile URL" />
          </div>
        </>
      )}

      {step === 8 && (
        <>
          <p className="step-panel-title">Security</p>
          <div className="field-grid">
            <Field label="Password" id="password" type="password" required value={form.password} onChange={update('password')} placeholder="Enter password" error={errors.password} />
            <Field label="Confirm password" id="confirmPassword" type="password" required value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Confirm password" error={errors.confirmPassword} />
          </div>
          <div className="checkbox-row">
            <label><input type="checkbox" checked={!!form.termsCheck} onChange={updateCheck('termsCheck')} /> I agree to the Terms & Conditions</label>
            <label><input type="checkbox" checked={!!form.privacyCheck} onChange={updateCheck('privacyCheck')} /> I agree to the Privacy Policy</label>
          </div>
        </>
      )}
    </StepWizard>
  );
}
