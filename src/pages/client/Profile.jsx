import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { clientService } from '../../services/clientService';
import { firstErrorMessage } from '../../utils/formErrors';

export default function ClientProfileEdit() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    fullName: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '',
    businessName: '',
    businessType: '',
    email: user?.email || '',
    location: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    clientService
      .getMyProfile()
      .then(({ data }) => {
        if (!active) return;
        setForm((f) => ({
          ...f,
          fullName: data.user ? `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() : f.fullName,
          email: data.user?.email || f.email,
          businessName: data.company_name || '',
          businessType: data.industry || '',
          location: data.location || '',
          description: data.company_description || '',
        }));
      })
      .catch(() => {
        // No backend / not a client account yet in this environment — the
        // form still works, it just starts blank instead of pre-filled.
      });
    return () => {
      active = false;
    };
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clientService.updateProfile({
        company_name: form.businessName,
        industry: form.businessType,
        location: form.location,
        company_description: form.description,
      });
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
          <h2>Client Profile</h2>
          <p>Keep your business details polished and visible.</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit} style={{ maxWidth: '680px' }}>
        <div className="field-grid">
          <div className="field-group full">
            <label>Full Name</label>
            <input value={form.fullName} onChange={update('fullName')} placeholder="Full Name" disabled />
          </div>
          <div className="field-group full">
            <label>Business Name</label>
            <input value={form.businessName} onChange={update('businessName')} placeholder="Business Name" />
          </div>
          <div className="field-group full">
            <label>Business Type / Industry</label>
            <input value={form.businessType} onChange={update('businessType')} placeholder="Business Type" />
          </div>
          <div className="field-group full">
            <label>Location</label>
            <input value={form.location} onChange={update('location')} placeholder="City, Country" />
          </div>
          <div className="field-group full">
            <label>Email</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="Email" disabled />
          </div>
          <div className="field-group full">
            <label>Company Description</label>
            <textarea rows={4} value={form.description} onChange={update('description')} placeholder="What does your business do?" />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving\u2026' : 'Save changes'}</button>
        </div>
      </form>
    </div>
  );
}
