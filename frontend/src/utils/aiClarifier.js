// AI Requirement Clarification Agent
//
// This is a deterministic, rule-based stand-in for the "AI requirement
// analyst" described in the product spec. It reads the client's free-text
// project request, detects the domain(s) it belongs to, and produces a
// branching queue of yes/no clarification questions — the same
// Requirement -> Missing Information -> Question -> Answer -> Next Question
// loop the real agent should follow.
//
// Swap this out for a live LLM call (Django backend endpoint or the
// Anthropic API) later without changing the shape it returns:
//   [{ id, rootId, text, tag }]
// `rootId === id` marks a root question for its topic; any question whose
// rootId points elsewhere is only shown if the root was answered "yes".

const TOPIC_RULES = [
  {
    test: /catalog|product|shop|store|e-?commerce|marketplace/,
    chain: [
      ['catalog', 'Do you want a product catalog?', 'Product catalog'],
      ['filter', 'Do you want users to be able to filter products?', 'Product filters'],
      ['category', 'Do you want product categories?', 'Product categories'],
      ['columns', 'Do you want an additional column for product information?', 'Extended product info'],
      ['cart', 'Do you want a shopping cart and checkout flow?', 'Cart & checkout'],
      ['payment', 'Do you want an online payment gateway?', 'Payment gateway'],
    ],
  },
  {
    test: /college|university|student|attendance|academic|campus/,
    chain: [
      ['registration', 'Do you want student registration and login?', 'Student registration'],
      ['attendance', 'Do you want an attendance tracking system?', 'Attendance tracking'],
      ['dashboard', 'Do you want a student and admin dashboard?', 'Dashboard'],
      ['fees', 'Do you want a fee or payment collection system?', 'Payment collection'],
      ['admin', 'Do you want an admin panel to manage records?', 'Admin panel'],
    ],
  },
  {
    test: /blog|news|article|magazine|publication/,
    chain: [
      ['posts', 'Do you want blog posts organized into categories?', 'Blog categories'],
      ['comments', 'Do you want a comment system on posts?', 'Comments'],
      ['authors', 'Do you want multiple author profiles?', 'Author profiles'],
    ],
  },
  {
    test: /book|appointment|reservation|schedule|slot/,
    chain: [
      ['calendar', 'Do you want a booking calendar?', 'Booking calendar'],
      ['slots', 'Do you want customizable time slots?', 'Time slots'],
      ['reminders', 'Do you want automatic booking reminders?', 'Booking reminders'],
      ['payment', 'Do you want online payment for bookings?', 'Booking payments'],
    ],
  },
  {
    test: /chat|social|community|forum|message/,
    chain: [
      ['messaging', 'Do you want real-time messaging between users?', 'Real-time messaging'],
      ['profiles', 'Do you want public user profiles?', 'User profiles'],
      ['notifications', 'Do you want activity notifications?', 'Notifications'],
    ],
  },
  {
    test: /portfolio|showcase|agency|studio/,
    chain: [
      ['gallery', 'Do you want a project gallery?', 'Project gallery'],
      ['testimonials', 'Do you want a client testimonials section?', 'Testimonials'],
      ['contact', 'Do you want a contact form?', 'Contact form'],
    ],
  },
  {
    test: /dashboard|analytics|report/,
    chain: [
      ['charts', 'Do you want charts and analytics visualizations?', 'Analytics charts'],
      ['export', 'Do you want to export reports as PDF or Excel?', 'Report export'],
    ],
  },
];

export function buildClarificationPlan(rawText) {
  const text = (rawText || '').toLowerCase();
  const plan = [];
  let matchedAny = false;

  TOPIC_RULES.forEach((rule) => {
    if (!rule.test.test(text)) return;
    matchedAny = true;
    const rootId = rule.chain[0][0];
    rule.chain.forEach(([id, question, tag]) => {
      plan.push({ id, rootId, text: question, tag });
    });
  });

  // Baseline questions asked on every project, appended after domain-specific ones.
  plan.push({ id: 'auth', rootId: 'auth', text: 'Do you want user login and registration?', tag: 'Authentication' });
  if (!matchedAny) {
    plan.push({ id: 'admin-generic', rootId: 'admin-generic', text: 'Do you want an admin panel to manage the content?', tag: 'Admin panel' });
  }
  plan.push({ id: 'mobile', rootId: 'mobile', text: 'Should the site work well on mobile devices?', tag: 'Mobile-responsive' });
  plan.push({ id: 'restyle', rootId: 'restyle', text: 'Do you want the content and design restyled with a custom theme?', tag: 'Custom design refresh' });

  // De-duplicate by tag (a phrase can trip more than one rule).
  const seen = new Set();
  return plan.filter((q) => {
    if (seen.has(q.tag)) return false;
    seen.add(q.tag);
    return true;
  });
}

// Given the full plan and the answers gathered so far, decide which question
// index should be shown next (skipping any question whose parent root was
// answered "No").
export function nextVisibleIndex(plan, answers, fromIndex) {
  let i = fromIndex;
  while (i < plan.length) {
    const q = plan[i];
    const isDependent = q.rootId !== q.id;
    if (isDependent && answers[q.rootId] === false) {
      i += 1;
      continue;
    }
    return i;
  }
  return plan.length;
}

export function visibleQuestions(plan, answers) {
  return plan.filter((q) => {
    const isDependent = q.rootId !== q.id;
    return !(isDependent && answers[q.rootId] === false);
  });
}
