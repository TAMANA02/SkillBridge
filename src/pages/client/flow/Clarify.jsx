import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Sparkles, X } from 'lucide-react';
import FlowStepper from '../../../components/flow/FlowStepper';
import { useProjectFlow } from '../../../context/ProjectFlowContext';
import { nextVisibleIndex, visibleQuestions } from '../../../utils/aiClarifier';

const STEPS = ['Describe', 'Clarify', 'Requirements', 'Budget', 'Review'];

export default function Clarify() {
  const { draft, setAnswer } = useProjectFlow();
  const navigate = useNavigate();
  const { plan, answers } = draft.clarification;
  const [pointer, setPointer] = useState(() => nextVisibleIndex(plan, answers, 0));

  useEffect(() => {
    if (!draft.search.text) navigate('/client/new-project');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!plan.length) return null;

  const visible = visibleQuestions(plan, answers);
  const answeredCount = visible.filter((q) => answers[q.id] !== undefined).length;
  const done = pointer >= plan.length;
  const current = plan[pointer];

  const answer = (value) => {
    if (!current) return;
    const updatedAnswers = { ...answers, [current.id]: value };
    setAnswer(current.id, value);
    setPointer(nextVisibleIndex(plan, updatedAnswers, pointer + 1));
  };

  return (
    <div className="flow-shell">
      <FlowStepper steps={STEPS} currentIndex={1} />

      <div className="clarify-head">
        <span className="eyebrow">AI requirement agent</span>
        <h2>Let's fill in the gaps</h2>
        <p>You said: <em>"{draft.search.text}"</em></p>
        <div className="clarify-progress">
          <div className="clarify-progress-bar">
            <div style={{ width: `${(answeredCount / Math.max(visible.length, 1)) * 100}%` }} />
          </div>
          <span>{Math.min(answeredCount, visible.length)} of {visible.length} answered</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="card clarify-card"
          >
            <span className="clarify-card-icon"><Sparkles size={16} /></span>
            <h3>{current.text}</h3>
            <div className="clarify-actions">
              <button type="button" className="btn btn-outline" onClick={() => answer(false)}>
                <X size={16} /> No
              </button>
              <button type="button" className="btn btn-primary" onClick={() => answer(true)}>
                <Check size={16} /> Yes
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card clarify-card clarify-done"
          >
            <h3>Requirements captured</h3>
            <p>We've noted what you need. Next, let's fill in the rest of the project details.</p>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/client/new-project/requirements')}>
              Continue to project details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
