import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Check if user is already logged in
useEffect(() => {
  console.log("AUTH CHECK RUNNING");
  checkAuth();
}, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        const role = localStorage.getItem("user_role");
        const endpoint = role === "student" ? "/students/me/" : "/clients/me/";

        const response = await api.get(endpoint);

        setUser(response.data);
        setUserRole(role);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");

      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);

    try {
      const role = formData.role || "student";

      let payload;
      let endpoint;

      if (role === "client") {
        // =========================
        // CLIENT REGISTRATION
        // =========================
        endpoint = "/auth/register/client/";

        const fullName = (
          formData.clientFullName ||
          formData.fullName ||
          ""
        ).trim();

        const nameParts = fullName.split(/\s+/);

        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "User";

        // Convert frontend business type to backend choice
        const industryMap = {
          technology: "tech",
          tech: "tech",
          software: "tech",
          it: "tech",
          finance: "finance",
          healthcare: "healthcare",
          "e-commerce": "ecommerce",
          ecommerce: "ecommerce",
          education: "education",
          other: "other",
        };

        const businessType = (formData.businessType || "other")
          .trim()
          .toLowerCase();

        payload = {
          email: formData.clientEmail || "",
          password: formData.clientPassword || "",

          first_name: firstName,
          last_name: lastName,

          company_name: formData.businessName || formData.companyName || "",

          industry: industryMap[businessType] || "other",

          company_size: formData.companySize || "startup",

          location: [
            formData.clientAddress,
            formData.clientCity,
            formData.clientState,
            formData.clientCountry,
            formData.clientPinCode,
          ]
            .filter(Boolean)
            .join(", "),

          budget_range_min: 0,
        };

        // Add description only if provided
        if (formData.companyDescription?.trim()) {
          payload.company_description = formData.companyDescription.trim();
        }

        // Add website only if provided
        if (formData.websiteUrl?.trim()) {
          payload.company_website = formData.websiteUrl.trim();
        }
      } else {
        // =========================
        // STUDENT REGISTRATION
        // =========================
        endpoint = "/auth/register/student/";

        payload = new FormData();

        // =========================
        // BASIC INFORMATION
        // =========================
        payload.append("email", formData.email || "");
        payload.append("password", formData.password || "");

        // Your StudentWizard uses confirmPassword
        payload.append(
          "password2",
          formData.confirmPassword || formData.password || "",
        );

        const fullName = (formData.fullName || "").trim();
        const nameParts = fullName.split(/\s+/);

        payload.append("first_name", nameParts[0] || "");

        payload.append("last_name", nameParts.slice(1).join(" ") || "User");

        payload.append("phone", formData.mobile || "");

        // =========================
        // PERSONAL INFORMATION
        // =========================
        if (formData.dob) {
          payload.append("date_of_birth", formData.dob);
        }

        payload.append("gender", formData.gender || "");

        payload.append("address", formData.address || "");

        payload.append("city", formData.city || "");

        payload.append("state", formData.state || "");

        payload.append("country", formData.country || "");

        // =========================
        // EDUCATION
        // =========================
        payload.append("college", formData.collegeName || "");

        payload.append("student_id", formData.studentId || "");

        payload.append("university_name", formData.universityName || "");

        payload.append("course", formData.course || "");

        payload.append("branch", formData.branch || "");

        payload.append("current_year", formData.currentYear || "");

        payload.append("graduation_year", formData.graduationYear || "");

        // =========================
        // PROFESSIONAL INFORMATION
        // =========================
        payload.append("headline", formData.professionalTitle || "");

        payload.append("bio", formData.shortBio || "");

        payload.append("career_objective", formData.careerObjective || "");

        // =========================
        // SKILLS
        // =========================
        const skills = Array.isArray(formData.skills)
          ? formData.skills
          : (formData.skillsInput || "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);

        const techStack = Array.isArray(formData.techStack)
          ? formData.techStack
          : (formData.techStack || "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);

        const languagesKnown = Array.isArray(formData.languagesKnown)
          ? formData.languagesKnown
          : (formData.languagesKnown || "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);

        payload.append("skills", JSON.stringify(skills));

        payload.append("tech_stack", JSON.stringify(techStack));

        payload.append("languages_known", JSON.stringify(languagesKnown));

        // =========================
        // EXPERIENCE
        // =========================
        payload.append("experience", JSON.stringify(formData.experience || []));

        payload.append(
          "experience_level",
          formData.experienceLevel || "beginner",
        );

        payload.append("availability", formData.availability || "part_time");

        if (formData.hourlyRate) {
          payload.append("hourly_rate", formData.hourlyRate);
        }

        // =========================
        // SOCIAL LINKS
        // =========================
        payload.append("portfolio_url", formData.portfolioLink || "");

        payload.append("github_url", formData.githubLink || "");

        payload.append("linkedin_url", formData.linkedinLink || "");

        payload.append("behance_url", formData.behanceLink || "");

        payload.append("dribbble_url", formData.dribbbleLink || "");

        // =========================
        // FILE UPLOADS
        // =========================
        if (formData.resumeUpload instanceof File) {
          payload.append("resume", formData.resumeUpload);
        }

        if (formData.profilePhoto instanceof File) {
          payload.append("profile_photo", formData.profilePhoto);
        }

        if (formData.collegeIdUpload instanceof File) {
          payload.append("college_id_document", formData.collegeIdUpload);
        }
      }

      const response = await api.post(endpoint, payload);

      // Save tokens
      localStorage.setItem("access_token", response.data.access);

      localStorage.setItem("refresh_token", response.data.refresh);

      localStorage.setItem("user_role", role);

      setUser(response.data.user);
      setUserRole(role);
      setIsAuthenticated(true);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Signup failed:", error);

      console.error(
        "Backend error:",
        JSON.stringify(error.response?.data, null, 2),
      );

      return {
        success: false,
        error: error.response?.data || { detail: error.message },
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login/", { email, password });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user_role", response.data.user.role);

      setUser(response.data.user);
      setUserRole(response.data.user.role);
      setIsAuthenticated(true);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Login failed:", error);
      console.error(
        "Login backend error:",
        JSON.stringify(error.response?.data, null, 2),
      );
      return {
        success: false,
        error: error.response?.data || { detail: error.message },
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        userRole,
        signup,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};
