import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { projectService } from '../services/projectService';
import { studentService } from '../services/studentService';
import { applicationService } from '../services/applicationService';
import { reviewService } from '../services/reviewService';
import { publicDevelopers, teams, colleges } from '../data/mockData';
import { rankMatches } from '../utils/matching';
import { MILESTONE_TEMPLATE } from '../data/flowTemplates';

const STORAGE_KEY = 'skillbridge_client_flow_v1';
function normalizeRealStudent(raw) {
  const user = raw.user || {};

  const name =
    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
    'SkillBridge developer';

  const skills = Array.isArray(raw.skills)
    ? raw.skills
    : [];

  const techStack = Array.isArray(raw.tech_stack)
    ? raw.tech_stack
    : [];

  const allSkills = [...new Set([...skills, ...techStack])];

  let image = raw.profile_photo || user.avatar || null;

  if (image && !image.startsWith('http')) {
    image = `http://127.0.0.1:8000${image}`;
  }

  return {
    id: raw.id,
    userId: user.id || raw.user_id || raw.id,
    name,
    title:
      raw.headline ||
      (raw.experience_level
        ? `${raw.experience_level} developer`
        : 'Developer'),

    skills: allSkills,

    rating: raw.rating ?? 0,
    projects: raw.projects_completed ?? 0,

    image,

    college: raw.college_name || '',
    availability: raw.availability || '',
    experienceLevel: raw.experience_level || '',

    bio: raw.bio || '',
    github_url: raw.github_url || '',
    linkedin_url: raw.linkedin_url || '',
    portfolio_url: raw.portfolio_url || '',
  };
}
const emptyDraft = () => ({
  search: { text: '', usedVoice: false },
  clarification: { plan: [], answers: {} },
  requirements: {
    title: '',
    titleOption: '',
    customTitle: '',
    description: '',
    category: '',
    appType: '',
    pages: '',
    functional: '',
    technical: '',
    frontend: [],
    backend: [],
    database: [],
    design: {
      theme: '',
      colors: '',
      uiStyle: '',
      layout: '',
      referenceUrl: '',
      typography: '',
      mode: 'light',
      branding: '',
      special: '',
    },
  },
  budget: { tier: '', custom: '' },
  timeline: { option: '', customDate: '' },
  extra: { communicationPref: 'chat', priority: 'standard', quality: 'production-ready', instructions: '', attachments: [] },
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { draft: emptyDraft(), projects: {}, activeProjectId: null };
    const parsed = JSON.parse(raw);
    return {
      draft: { ...emptyDraft(), ...parsed.draft },
      projects: parsed.projects || {},
      activeProjectId: parsed.activeProjectId || null,
    };
  } catch {
    return { draft: emptyDraft(), projects: {}, activeProjectId: null };
  }
}

const ProjectFlowContext = createContext(null);

export function ProjectFlowProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateDraft = useCallback((patch) => {
    setState((s) => ({ ...s, draft: { ...s.draft, ...patch } }));
  }, []);

  const resetDraft = useCallback(() => {
    setState((s) => ({ ...s, draft: emptyDraft() }));
  }, []);

  const setAnswer = useCallback((questionId, value) => {
    setState((s) => ({
      ...s,
      draft: {
        ...s.draft,
        clarification: {
          ...s.draft.clarification,
          answers: { ...s.draft.clarification.answers, [questionId]: value },
        },
      },
    }));
  }, []);

  const setClarificationPlan = useCallback((plan) => {
    setState((s) => ({ ...s, draft: { ...s.draft, clarification: { plan, answers: {} } } }));
  }, []);

  const deriveTags = useCallback((draft) => {
    const featureTags = Object.entries(draft.clarification.answers || {})
      .filter(([, val]) => val === true)
      .map(([id]) => {
        const q = draft.clarification.plan.find((p) => p.id === id);
        return q?.tag;
      })
      .filter(Boolean);
    return [...draft.requirements.frontend, ...draft.requirements.backend, ...draft.requirements.database, ...featureTags];
  }, []);

  const submitPacket = useCallback(async () => {
    const draft = state.draft;
    const tags = deriveTags(draft);
    const id = `proj-${Date.now()}`;

    const payload = {
      title: draft.requirements.title,
      description: draft.requirements.description,
      category: draft.requirements.category,
      required_skills: tags,
      budget_type: 'fixed',
      budget_min: draft.budget.tier === 'custom' ? Number(String(draft.budget.custom).replace(/[^\d.]/g, '')) || 0 : 0,
      budget_max: null,
      duration_weeks: null,
      experience_level: 'intermediate',
      deadline: draft.timeline.option === 'custom' && draft.timeline.customDate ? `${draft.timeline.customDate}T23:59:59` : null,
    };

    let backendId = null;
    try {
      const response = await projectService.createProject(payload);
      backendId = response?.data?.id ?? null;
    } catch (error) {
      // Backend not reachable in this environment — continue with the
      // locally generated packet so the workflow stays demoable offline.
      console.warn('Falling back to local project packet (backend unavailable):', error?.message);
    }

    let realDevelopers = [];

try {
  const response = await studentService.list();

  const students =
    response?.data?.results ||
    response?.data ||
    [];

  realDevelopers = students.map(normalizeRealStudent);

  console.log('Registered developers loaded:', realDevelopers);
} catch (error) {
  console.error('Could not load registered developers:', error);
}

const developersForMatching =
  realDevelopers.length > 0
    ? realDevelopers
    : publicDevelopers;

const { developerMatches, teamMatches, collegeMatches } = rankMatches({
  tags,
  developers: developersForMatching,
  teams,
  colleges,
});

    const record = {
      id,
      backendId,
      createdAt: new Date().toISOString(),
      packet: draft,
      tags,
      status: 'matching',
      matches: { developerMatches, teamMatches, collegeMatches },
      providerResponse: null,
      applicationId: null,
      selected: null,
      agreement: null,
      workspace: null,
      rating: null,
    };

    setState((s) => ({
      ...s,
      projects: { ...s.projects, [id]: record },
      activeProjectId: id,
      draft: emptyDraft(),
    }));

    return id;
  }, [state.draft, deriveTags]);

  const selectMatch = useCallback((projectId, match) => {
    setState((s) => {
      const project = s.projects[projectId];
      if (!project) return s;
      const milestones = MILESTONE_TEMPLATE.map((m) => ({ ...m, status: 'pending' }));
      const agreement = {
        milestones,
        budget: project.packet.budget,
        timeline: project.packet.timeline,
        clientAccepted: false,
        providerAccepted: false,
        generatedAt: new Date().toISOString(),
      };
      return {
        ...s,
        projects: {
          ...s.projects,
          [projectId]: { ...project, selected: match, agreement, status: 'agreement_pending' },
        },
      };
    });
  }, []);

  const acceptAgreementClient = useCallback((projectId) => {
    setState((s) => {
      const project = s.projects[projectId];
      if (!project) return s;
      return {
        ...s,
        projects: {
          ...s.projects,
          [projectId]: {
            ...project,
            agreement: { ...project.agreement, clientAccepted: true },
          },
        },
      };
    });
  }, []);

  const providerAccept = useCallback((projectId) => {
    setState((s) => {
      const project = s.projects[projectId];
      if (!project || !project.agreement) return s;
      const milestones = project.agreement.milestones.map((m, i) => ({
        ...m,
        status: i === 0 ? 'in_progress' : 'pending',
      }));
      return {
        ...s,
        projects: {
          ...s.projects,
          [projectId]: {
            ...project,
            status: 'active',
            agreement: { ...project.agreement, providerAccepted: true },
            workspace: {
              milestones,
              progress: 0,
              badgesEarned: [],
              performance: { score: 0, milestoneSuccess: 0, onTime: 0, satisfaction: 0, accuracy: 0 },
            },
          },
        },
      };
    });
  }, []);

  const respondToOpportunity = useCallback(async (projectId, { response, feedback }) => {
    let applicationId = null;
    if (response === 'accepted') {
      try {
        const project = state.projects[projectId];
        const res = await applicationService.apply({
          projectId: project?.backendId || undefined,
          coverLetter: feedback || 'Interested — this matches my skill set.',
        });
        applicationId = res?.data?.id ?? null;
      } catch (error) {
        // The demo project usually only exists locally (no matching backend
        // Project row), or the API isn't reachable — record the response
        // locally so the workflow still moves forward.
        console.warn('Could not create a backend application, recording locally:', error?.message);
      }
    }

    setState((s) => {
      const project = s.projects[projectId];
      if (!project) return s;
      return {
        ...s,
        projects: {
          ...s.projects,
          [projectId]: {
            ...project,
            applicationId: applicationId || project.applicationId,
            providerResponse: { response, feedback: feedback || '', respondedAt: new Date().toISOString() },
          },
        },
      };
    });
  }, [state.projects]);

  const submitMilestoneWork = useCallback((projectId, submission) => {
    setState((s) => {
      const project = s.projects[projectId];
      if (!project?.workspace) return s;
      const milestones = [...project.workspace.milestones];
      const activeIdx = milestones.findIndex((m) => m.status === 'in_progress');
      if (activeIdx === -1) return s;
      milestones[activeIdx] = {
        ...milestones[activeIdx],
        status: 'submitted',
        submission: { ...submission, submittedAt: new Date().toISOString() },
      };
      return {
        ...s,
        projects: { ...s.projects, [projectId]: { ...project, workspace: { ...project.workspace, milestones } } },
      };
    });
  }, []);

  const reviewMilestone = useCallback((projectId, decision, note = '') => {
    setState((s) => {
      const project = s.projects[projectId];
      if (!project?.workspace) return s;
      const milestones = [...project.workspace.milestones];
      const activeIdx = milestones.findIndex((m) => m.status === 'submitted');
      if (activeIdx === -1) return s;

      const badgesEarned = [...project.workspace.badgesEarned];

      if (decision === 'revise') {
        milestones[activeIdx] = { ...milestones[activeIdx], status: 'in_progress', revisionNote: note };
        return {
          ...s,
          projects: { ...s.projects, [projectId]: { ...project, workspace: { ...project.workspace, milestones } } },
        };
      }

      milestones[activeIdx] = { ...milestones[activeIdx], status: 'completed', revisionNote: '' };
      if (milestones[activeIdx].badge) badgesEarned.push(milestones[activeIdx].badge);
      if (activeIdx + 1 < milestones.length) {
        milestones[activeIdx + 1] = { ...milestones[activeIdx + 1], status: 'in_progress' };
      }

      const completedCount = milestones.filter((m) => m.status === 'completed').length;
      const progress = Math.round((completedCount / milestones.length) * 100);
      const allDone = completedCount === milestones.length;

      const performance = {
        score: Math.min(99, 70 + completedCount * 4),
        milestoneSuccess: progress,
        onTime: Math.min(99, 82 + completedCount * 2),
        satisfaction: Math.min(99, 85 + completedCount),
        accuracy: Math.min(99, 80 + completedCount * 2),
      };

      return {
        ...s,
        projects: {
          ...s.projects,
          [projectId]: {
            ...project,
            status: allDone ? 'completed' : 'active',
            workspace: { milestones, progress, badgesEarned, performance },
          },
        },
      };
    });
  }, []);

  const submitRating = useCallback(async (projectId, rating) => {
    const project = state.projects[projectId];
    try {
      const revieweeId = project?.selected?.entity?.userId;
      if (revieweeId) {
        await reviewService.createReview({
          revieweeId,
          projectId: project?.backendId || null,
          rating: rating.stars,
          comment: rating.feedback || rating.highlights.join(', '),
        });
      }
    } catch (error) {
      console.warn('Could not sync review to backend, keeping it local:', error?.message);
    }

    setState((s) => {
      const p = s.projects[projectId];
      if (!p) return s;
      return { ...s, projects: { ...s.projects, [projectId]: { ...p, rating } } };
    });
  }, [state.projects]);

  const getProject = useCallback((id) => state.projects[id] || null, [state.projects]);

  const value = useMemo(
    () => ({
      draft: state.draft,
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      updateDraft,
      resetDraft,
      setAnswer,
      setClarificationPlan,
      deriveTags,
      submitPacket,
      selectMatch,
      respondToOpportunity,
      acceptAgreementClient,
      providerAccept,
      submitMilestoneWork,
      reviewMilestone,
      submitRating,
      getProject,
    }),
    [state, updateDraft, resetDraft, setAnswer, setClarificationPlan, deriveTags, submitPacket, selectMatch, respondToOpportunity, acceptAgreementClient, providerAccept, submitMilestoneWork, reviewMilestone, submitRating, getProject]
  );

  return <ProjectFlowContext.Provider value={value}>{children}</ProjectFlowContext.Provider>;
}

export function useProjectFlow() {
  const ctx = useContext(ProjectFlowContext);
  if (!ctx) throw new Error('useProjectFlow must be used inside a ProjectFlowProvider');
  return ctx;
}
