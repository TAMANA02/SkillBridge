import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToHash from "./components/ScrollToHash";

import Home from "./pages/Home";
import Services from "./pages/Services";
import AIProjectCompletion from "./pages/AIProjectCompletion";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentProfile from "./pages/StudentProfile";
import NotFound from "./pages/NotFound";
import Discover from "./pages/Discover";
import Teams from "./pages/Teams";
import TeamProfile from "./pages/TeamProfile";
import TeamRegistration from "./pages/TeamRegistration";
import Colleges from "./pages/Colleges";
import CollegeProfile from "./pages/CollegeProfile";
import Feed from "./pages/Feed";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

import StudentDashboard from "./pages/student/Dashboard";
import StudentJobs from "./pages/student/Jobs";
import StudentProjects from "./pages/student/Projects";
import StudentProfileEdit from "./pages/student/Profile";

import Opportunities from "./pages/student/flow/Opportunities";
import OpportunityDetail from "./pages/student/flow/OpportunityDetail";
import ProviderAgreement from "./pages/student/flow/ProviderAgreement";
import ProviderWorkspace from "./pages/student/flow/ProviderWorkspace";
import Performance from "./pages/student/flow/Performance";

import ClientDashboard from "./pages/client/Dashboard";
import PostProject from "./pages/client/PostProject";
import ManageProjects from "./pages/client/ManageProjects";
import ClientProfileEdit from "./pages/client/Profile";

import ProjectSearch from "./pages/client/flow/ProjectSearch";
import Clarify from "./pages/client/flow/Clarify";
import Requirements from "./pages/client/flow/Requirements";
import BudgetTimeline from "./pages/client/flow/BudgetTimeline";
import ReviewPacket from "./pages/client/flow/ReviewPacket";
import Matches from "./pages/client/flow/Matches";
import Agreement from "./pages/client/flow/Agreement";
import Workspace from "./pages/client/flow/Workspace";
import CompleteProject from "./pages/client/flow/CompleteProject";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <ToastProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/ai-project-completion"
              element={<AIProjectCompletion />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/student-profile/:id" element={<StudentProfile />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="/developers/:id" element={<StudentProfile />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/register" element={<TeamRegistration />} />
            <Route path="/teams/:slug" element={<TeamProfile />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/colleges/:slug" element={<CollegeProfile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
          </Route>

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <DashboardLayout role="student" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="jobs" element={<StudentJobs />} />
            <Route path="projects" element={<StudentProjects />} />
            <Route path="profile" element={<StudentProfileEdit />} />

            <Route path="opportunities" element={<Opportunities />} />
            <Route path="opportunities/:id" element={<OpportunityDetail />} />
            <Route
              path="projects/:id/agreement"
              element={<ProviderAgreement />}
            />
            <Route
              path="projects/:id/workspace"
              element={<ProviderWorkspace />}
            />
            <Route path="performance" element={<Performance />} />
          </Route>

          <Route
            path="/client"
            element={
              <ProtectedRoute role="client">
                <DashboardLayout role="client" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="post-project" element={<PostProject />} />
            <Route path="manage-projects" element={<ManageProjects />} />
            <Route path="profile" element={<ClientProfileEdit />} />

            <Route path="new-project" element={<ProjectSearch />} />
            <Route path="new-project/clarify" element={<Clarify />} />
            <Route path="new-project/requirements" element={<Requirements />} />
            <Route path="new-project/budget" element={<BudgetTimeline />} />
            <Route path="new-project/review" element={<ReviewPacket />} />

            <Route path="projects/:id/matches" element={<Matches />} />
            <Route path="projects/:id/agreement" element={<Agreement />} />
            <Route path="projects/:id/workspace" element={<Workspace />} />
            <Route path="projects/:id/complete" element={<CompleteProject />} />
          </Route>

          <Route path="*" element={<PublicLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
