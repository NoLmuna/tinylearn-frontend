import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  GraduationCap,
  Users,
  BookOpen,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import logo from "../assets/levelup-logo.png";
import { useLogin } from "../hooks/authHooks.jsx";
import { useAdmin } from "../contexts/adminContext.jsx";

/**
 * Main Login Page Component
 * Unified login for Students, Parents, and Teachers
 * Role is automatically detected from backend after authentication
 */
function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAdmin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [hoveredRole, setHoveredRole] = useState(null);

  // Informational role display
  const roles = [
    {
      id: "student",
      title: "Student",
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      id: "parent",
      title: "Parent",
      icon: Users,
      color: "bg-green-500",
    },
    {
      id: "teacher",
      title: "Teacher",
      icon: BookOpen,
      color: "bg-indigo-500",
    },
  ];

  const loginMutation = useLogin();

  // Navigate to the appropriate dashboard once auth state is updated
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === "student") navigate("/student/dashboard", { replace: true });
      else if (role === "parent")
        navigate("/parent/dashboard", { replace: true });
      else if (role === "teacher")
        navigate("/teacher/dashboard", { replace: true });
      else if (role === "admin")
        navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync(formData);
      // Navigation is handled by the useEffect above once isAuthenticated becomes true
    } catch (err) {
      if (err?.name === "ZodError") {
        const first = err.errors?.[0];
        const msg = first?.message ?? "Please check the form fields.";
        setError(msg);
        toast.error(msg, { id: "login-error" });
        return;
      }

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid credentials. Please try again.";
      setError(message);
      toast.error(message, { id: "login-error" });
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#FFF9E6] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#F4C21A]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block group">
            <img
              src={logo}
              alt="Level Up Learning Center"
              className="h-24 w-24 object-contain mx-auto mb-5 transition-transform group-hover:scale-105"
            />
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Welcome Back!
          </h1>
          <p className="text-lg text-slate-600">
            Sign in to continue your learning journey
          </p>
        </div>

        <Card className="bg-white shadow-2xl border border-slate-200 rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-8 pt-10 bg-gradient-to-b from-gray-50 to-white border-b border-slate-100">
            <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
              Sign In
            </CardTitle>
            <p className="text-sm text-slate-600 font-medium">
              For Students, Parents & Teachers
            </p>
          </CardHeader>

          <CardContent className="px-8 pt-8 pb-10">
            {/* Informational Role Display */}
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isHovered = hoveredRole === role.id;
                  return (
                    <div
                      key={role.id}
                      onMouseEnter={() => setHoveredRole(role.id)}
                      onMouseLeave={() => setHoveredRole(null)}
                      className={`
                        flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-default
                        ${
                          isHovered
                            ? "border-[#F4C21A] bg-[#F4C21A]/5 shadow-md scale-105"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-12 h-12 mb-2.5 rounded-xl flex items-center justify-center transition-all duration-200
                        ${role.color} ${isHovered ? "scale-110 shadow-lg" : "shadow-md"}
                      `}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {role.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3.5 rounded-r-lg flex items-start gap-3 shadow-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium leading-relaxed">
                    {error}
                  </span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-slate-900 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white border-2 border-slate-300 text-slate-900 text-base rounded-xl focus:outline-none focus:ring-4 focus:ring-[#F4C21A]/20 focus:border-[#F4C21A] transition-all duration-200 placeholder-gray-400"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-900"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-[#F4C21A] hover:text-[#d4a617] transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-white border-2 border-slate-300 text-slate-900 text-base rounded-xl focus:outline-none focus:ring-4 focus:ring-[#F4C21A]/20 focus:border-[#F4C21A] transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-[#F4C21A] hover:bg-[#d4a617] active:bg-[#c09615] text-black font-bold text-lg shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 border-none py-4 rounded-xl mt-6 focus:outline-none focus:ring-4 focus:ring-[#F4C21A]/40"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In to Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#F4C21A] transition-colors font-medium text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link
            to="/admin/login"
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium px-3 py-1.5 rounded-md hover:bg-slate-100"
          >
            Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
