import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FlowStepper from '../../../components/flow/FlowStepper';
import VoiceSearchButton from '../../../components/flow/VoiceSearchButton';
import { useProjectFlow } from '../../../context/ProjectFlowContext';
import { buildClarificationPlan } from '../../../utils/aiClarifier';

const STEPS = ['Describe', 'Clarify', 'Requirements', 'Budget', 'Review'];

const EXAMPLES = [
  'A college management website with student registration, attendance, dashboard and payment system.',
  'A product catalog website where shoppers can filter and browse by category.',
  'A booking platform for a salon with online payments and reminders.',
];

const headline = 'What project do you want to build?';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const word = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProjectSearch() {
  const [text, setText] = useState('');
  const [usedVoice, setUsedVoice] = useState(false);
  const { updateDraft, setClarificationPlan } = useProjectFlow();
  const navigate = useNavigate();

  const handleVoiceResult = (transcript) => {
    setText((t) => (t ? `${t} ${transcript}` : transcript));
    setUsedVoice(true);
  };

  const handleContinue = () => {
    if (!text.trim()) return;
    updateDraft({ search: { text: text.trim(), usedVoice } });
    setClarificationPlan(buildClarificationPlan(text));
    navigate('/client/new-project/clarify');
  };

  return (
    <div className="flow-shell">
      <FlowStepper steps={STEPS} currentIndex={0} />

      <div className="flow-hero">
        <motion.h1 variants={container} initial="hidden" animate="show" className="flow-hero-heading">
          {headline.split(' ').map((w, i) => (
            <motion.span key={i} variants={word} style={{ display: 'inline-block', marginRight: '0.28em' }}>
              {w}
            </motion.span>
          ))}
        </motion.h1>
        <p className="flow-hero-sub">
          Tell SkillBridge what you need in plain language, or describe it out loud. Our requirement agent will ask a
          few quick questions to fill in the gaps before we match you with developers.
        </p>

        <div className="search-hero-input">
          <textarea
            rows={4}
            placeholder="I want a college management website with student registration, attendance, dashboard and payment system."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <VoiceSearchButton onResult={handleVoiceResult} />
        </div>

        <div className="flow-examples">
          <span>Or try one of these</span>
          <div className="chip-row">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" className="chip" onClick={() => setText(ex)}>
                {ex.length > 46 ? `${ex.slice(0, 46)}\u2026` : ex}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-primary" disabled={!text.trim()} onClick={handleContinue}>
            Start requirement analysis <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
