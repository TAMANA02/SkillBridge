export default function FlowStepper({ steps, currentIndex }) {
  return (
    <div className="flow-stepper">
      <div className="step-track">
        {steps.map((label, i) => (
          <div key={label} className={`step-pill ${i < currentIndex ? 'done' : ''} ${i === currentIndex ? 'active' : ''}`} />
        ))}
      </div>
      <div className="flow-stepper-labels">
        {steps.map((label, i) => (
          <span key={label} className={i === currentIndex ? 'current' : ''}>{label}</span>
        ))}
      </div>
    </div>
  );
}
