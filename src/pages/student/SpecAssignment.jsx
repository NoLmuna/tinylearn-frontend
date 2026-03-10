import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Send,
  Save,
} from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useStudentAssignmentById,
  useCreateSubmission,
  useUpdateSubmission,
} from "../../hooks/studentHooks";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

/**
 * Student Assignment View and Submission Page
 * Allows students to view assignment details and submit their work
 */
function SpecAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: assignmentData, isLoading } = useStudentAssignmentById(id);
  const createSubmission = useCreateSubmission();
  const updateSubmission = useUpdateSubmission();

  const assignment = assignmentData?.data || null;
  const submission = assignment?.submission || null;

  const [formData, setFormData] = useState({
    content: "",
    attachments: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing submission if available
  useEffect(() => {
    if (submission) {
      setFormData({
        content: submission.content || "",
        attachments: submission.attachments || [],
      });
    }
  }, [submission]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.content.trim()) {
      errors.content = "Please provide your answer or work";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (submission) {
        // Update existing submission as draft
        await updateSubmission.mutateAsync({
          submissionId: submission._id || submission.id,
          submissionData: {
            content: formData.content,
            attachments: formData.attachments,
          },
        });
      } else {
        // Create new submission as draft
        await createSubmission.mutateAsync({
          assignmentId: id,
          content: formData.content,
          attachments: formData.attachments,
        });
      }

      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Save draft error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to save draft. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to submit this assignment? You won't be able to edit it after submission.",
      )
    ) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (submission) {
        // Update existing submission and mark as submitted
        await updateSubmission.mutateAsync({
          submissionId: submission._id || submission.id,
          submissionData: {
            content: formData.content,
            attachments: formData.attachments,
            status: "submitted",
          },
        });
      } else {
        // Create new submission (mark as submitted)
        await createSubmission.mutateAsync({
          assignmentId: id,
          content: formData.content,
          attachments: formData.attachments,
          status: "submitted",
        });
      }

      alert("Assignment submitted successfully!");
      navigate("/student/dashboard");
    } catch (error) {
      console.error("Submit error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to submit assignment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No due date";
    const date = new Date(dueDate);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue =
    assignment &&
    new Date(assignment.dueDate) < new Date() &&
    (!submission || submission.status === "draft");
  const daysUntilDue = assignment ? getDaysUntilDue(assignment.dueDate) : null;
  const canEdit =
    !submission ||
    (submission.status !== "graded" && submission.status !== "submitted");
  const isGraded = submission?.status === "graded";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white/80 p-10 rounded-[3rem] shadow-xl backdrop-blur-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-[#F4C21A] rounded-full flex items-center justify-center animate-bounce shadow-lg border-4 border-white">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <div className="text-3xl text-indigo-700 font-black tracking-wide">
            Loading quest...
          </div>
          <p className="text-indigo-500 mt-3 font-semibold text-lg">
            Gathering your gear! ⚔️
          </p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white/80 p-12 rounded-[3rem] shadow-xl backdrop-blur-sm border-4 border-dashed border-indigo-200">
          <AlertCircle className="w-24 h-24 mx-auto text-indigo-300 mb-4 animate-pulse" />
          <h2 className="text-3xl font-black text-indigo-900 mb-2">
            Quest not found 🗺️
          </h2>
          <p className="text-lg text-indigo-600 font-semibold mb-8">
            The quest you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <Button
            onClick={() => navigate("/student/dashboard")}
            className="bg-[#F4C21A] hover:bg-[#FFD700] text-indigo-900 font-black py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back to Home Base 🏡
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#F4C21A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to="/student/dashboard"
              className="flex items-center gap-3 group"
            >
              <img
                src={logo}
                alt="TinyLearn"
                className="h-14 w-14 object-contain transition-transform group-hover:scale-110"
              />
              <span className="text-2xl font-black text-gray-900">
                TinyLearn
              </span>
            </Link>
            <Button
              onClick={() => navigate("/student/dashboard")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Assignment Header */}
        <Card className="mb-6 border-2 border-[#F4C21A]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                  {assignment.title}
                </CardTitle>
                {assignment.lessonId && (
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-semibold">
                      Linked Lesson: {assignment.lessonId.title}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {formatDueDate(assignment.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="capitalize">
                      {assignment.assignmentType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      Max Points: {assignment.maxPoints}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                {isOverdue && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Overdue
                  </div>
                )}
                {!isOverdue &&
                  daysUntilDue !== null &&
                  daysUntilDue <= 1 &&
                  daysUntilDue >= 0 && (
                    <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Due Soon
                    </div>
                  )}
                {submission?.status === "submitted" && (
                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Submitted
                  </div>
                )}
                {isGraded && (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Graded
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Assignment Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Assignment Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {assignment.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submission Form */}
        {canEdit ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Your Submission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Answer / Work *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="12"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4C21A] ${
                      formErrors.content ? "border-red-300" : "border-gray-200"
                    }`}
                    placeholder="Type your answer, work, or response here..."
                  />
                  {formErrors.content && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.content}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                    variant="outline"
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-[#F4C21A] hover:bg-[#d4a617] text-black font-bold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Assignment"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Your Submission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Answer / Work
                  </label>
                  <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {submission?.content || "No content submitted"}
                    </p>
                  </div>
                </div>

                {isGraded && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-800">Graded</span>
                    </div>
                    <div className="space-y-2">
                      {submission.score !== null &&
                        submission.score !== undefined && (
                          <div>
                            <span className="font-semibold text-gray-700">
                              Score:{" "}
                            </span>
                            <span className="font-bold text-green-700">
                              {submission.score} / {assignment.maxPoints}
                            </span>
                          </div>
                        )}
                      {submission.feedback && (
                        <div>
                          <span className="font-semibold text-gray-700">
                            Feedback:{" "}
                          </span>
                          <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                            {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SpecAssignment;
