import { AnimatePresence, motion } from 'framer-motion';

export default function StepWizard({ step, totalSteps, onPrev, onNext, message, children, nextLabel, nextDisabled }) {
  return (
    <div className="card step-wizard">
      <div className="step-wizard-head">
        <span className="eyebrow">Step {step} of {totalSteps}</span>
      </div>
      <div className="step-track">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`step-pill ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'done' : ''}`} />
        ))}
      </div>

      {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onPrev} disabled={step === 1}>
          Back
        </button>
        <button type="button" className="btn btn-primary" onClick={onNext} disabled={nextDisabled}>
          {nextLabel || (step === totalSteps ? 'Submit' : 'Next')}
        </button>
      </div>
    </div>
  );
}
