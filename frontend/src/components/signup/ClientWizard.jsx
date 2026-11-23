import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepWizard from './StepWizard';
import Field from './Field';
import { useAuth } from '../../context/AuthContext';
import { firstErrorMessage } from '../../utils/formErrors';

const TOTAL_STEPS = 4;

const STEP_REQUIRED_FIELDS = {
  1: ['clientFullName', 'clientEmail', 'clientPhone', 'clientPassword', 'clientConfirmPassword'],
  2: ['businessName', 'businessType', 'designation', 'businessEmail'],
  3: ['clientCountry', 'clientState', 'clientCity', 'clientAddress', 'clientPinCode'],
  4: ['governmentId', 'clientTermsCheck'],
};

export default function ClientWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateFile = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.files?.[0]?.name || '' }));
  const updateCheck = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));

  const validateStep = () => {
    const required = STEP_REQUIRED_FIELDS[step];
    const nextErrors = {};
    required.forEach((field) => {
      if (!form[field]) nextErrors[field] = 'This field is required.';
    });
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
    const { success, error } = await signup({
      ...form,
      role: 'client',
      email: form.clientEmail,
      fullName: form.clientFullName,
    });
    if (success) {
      setMessage({ type: 'success', text: 'Client account created successfully.' });
      setTimeout(() => navigate('/client/dashboard'), 500);
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
          <p className="step-panel-title">Personal & Account</p>
          <div className="field-grid">
            <Field label="Full name" id="clientFullName" required value={form.clientFullName} onChange={update('clientFullName')} placeholder="Enter full name" error={errors.clientFullName} />
            <Field label="Email" id="clientEmail" type="email" required value={form.clientEmail} onChange={update('clientEmail')} placeholder="Enter email address" error={errors.clientEmail} />
            <Field label="Phone" id="clientPhone" type="tel" required value={form.clientPhone} onChange={update('clientPhone')} placeholder="Enter phone number" error={errors.clientPhone} />
            <Field label="Password" id="clientPassword" type="password" required value={form.clientPassword} onChange={update('clientPassword')} placeholder="Create a password" error={errors.clientPassword} />
            <Field label="Confirm password" id="clientConfirmPassword" type="password" required value={form.clientConfirmPassword} onChange={update('clientConfirmPassword')} placeholder="Confirm password" error={errors.clientConfirmPassword} />
            <Field label="Profile photo" id="clientProfilePhoto" type="file" accept="image/*" onChange={updateFile('clientProfilePhoto')} />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="step-panel-title">Business Details</p>
          <div className="field-grid">
            <Field label="Business name" id="businessName" required value={form.businessName} onChange={update('businessName')} placeholder="Enter business name" error={errors.businessName} />
            <Field label="Business type" id="businessType" required value={form.businessType} onChange={update('businessType')} placeholder="e.g. SaaS, Agency" error={errors.businessType} />
            <Field label="Company name" id="companyName" value={form.companyName} onChange={update('companyName')} placeholder="Optional" />
            <Field label="Designation" id="designation" required value={form.designation} onChange={update('designation')} placeholder="Enter designation" error={errors.designation} />
            <Field label="Business email" id="businessEmail" type="email" required value={form.businessEmail} onChange={update('businessEmail')} placeholder="Enter business email" error={errors.businessEmail} />
            <Field label="GST number" id="gstNumber" value={form.gstNumber} onChange={update('gstNumber')} placeholder="Optional" />
            <Field label="Website" id="websiteUrl" type="url" value={form.websiteUrl} onChange={update('websiteUrl')} placeholder="Optional website" />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p className="step-panel-title">Address</p>
          <div className="field-grid">
            <Field label="Country" id="clientCountry" required value={form.clientCountry} onChange={update('clientCountry')} placeholder="Enter country" error={errors.clientCountry} />
            <Field label="State" id="clientState" required value={form.clientState} onChange={update('clientState')} placeholder="Enter state" error={errors.clientState} />
            <Field label="City" id="clientCity" required value={form.clientCity} onChange={update('clientCity')} placeholder="Enter city" error={errors.clientCity} />
            <Field label="Full address" id="clientAddress" type="textarea" rows={3} required full value={form.clientAddress} onChange={update('clientAddress')} placeholder="Enter your full address" error={errors.clientAddress} />
            <Field label="PIN code" id="clientPinCode" required value={form.clientPinCode} onChange={update('clientPinCode')} placeholder="PIN code" error={errors.clientPinCode} />
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <p className="step-panel-title">Verification</p>
          <div className="field-grid">
            <Field label="Business logo" id="businessLogo" type="file" accept="image/*" onChange={updateFile('businessLogo')} />
            <Field label="Government ID" id="governmentId" type="file" accept="image/*,application/pdf" required onChange={updateFile('governmentId')} error={errors.governmentId} />
          </div>
          <div className="checkbox-row">
            <label><input type="checkbox" checked={!!form.clientTermsCheck} onChange={updateCheck('clientTermsCheck')} /> I agree to the Terms & Conditions</label>
          </div>
        </>
      )}
    </StepWizard>
  );
}
