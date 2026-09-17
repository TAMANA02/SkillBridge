function textOf(context) {
  return Object.values(context).filter(Boolean).join(' ').toLowerCase();
}

export function recommendRequirement(kind, context) {
  const text = textOf(context);
  const isCommerce = /shop|store|commerce|payment|product/.test(text);
  const isLearning = /learning|course|education|student|school/.test(text);
  const isAi = /ai|machine learning|ml|prediction|recommend/.test(text);

  const recommendations = {
    functional: isCommerce
      ? 'Product browsing, search and filters, cart, checkout, payment confirmation, and order tracking.'
      : isLearning
        ? 'User registration, course discovery, enrollment, progress tracking, notifications, and admin management.'
        : 'User authentication, a clear primary workflow, search and filtering, notifications, and an admin dashboard.',
    technical: isAi
      ? 'Use a secure REST API, background processing for model tasks, input validation, monitoring, and a scalable deployment.'
      : 'Responsive accessible UI, secure REST API, validation, role-based access, automated tests, and production deployment.',
    pages: isCommerce
      ? 'Home, product catalog, product details, cart, checkout, account, order tracking, and admin dashboard.'
      : isLearning
        ? 'Landing page, sign in, course catalog, course detail, learner dashboard, progress view, and admin dashboard.'
        : 'Landing page, authentication, dashboard, primary workflow screens, profile/settings, help, and admin dashboard.',
    frontend: isCommerce ? 'Next.js' : 'React',
    backend: isAi ? 'Python' : 'Django',
    database: isCommerce || isLearning ? 'PostgreSQL' : 'MongoDB',
    theme: isCommerce ? 'Modern' : isLearning ? 'Professional' : 'Minimal',
    colors: isCommerce ? 'Clean neutral palette with one confident accent for calls to action.' : 'Accessible neutral palette with a calm primary accent and strong contrast.',
    typography: 'Readable sans-serif for body copy paired with a distinctive but restrained display face for headings.',
    branding: 'Clear logo style, consistent color direction, accessible visual tone, and reusable branded UI elements.',
  };

  return recommendations[kind] || '';
}