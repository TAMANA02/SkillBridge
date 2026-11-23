export default function Field({ label, id, value, onChange, type = 'text', placeholder, required, options, rows, full, error, accept }) {
  const commonProps = {
    id,
    value: value ?? '',
    onChange,
    placeholder,
    className: error ? 'error' : '',
  };

  return (
    <div className={`field-group ${full ? 'full' : ''}`}>
      <label htmlFor={id}>{label}{required && <span className="req">*</span>}</label>
      {type === 'select' ? (
        <select {...commonProps}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea {...commonProps} rows={rows || 4} />
      ) : type === 'file' ? (
        <input id={id} type="file" onChange={onChange} accept={accept} className={error ? 'error' : ''} />
      ) : (
        <input {...commonProps} type={type} />
      )}
      <div className="field-error">{error || ''}</div>
    </div>
  );
}
