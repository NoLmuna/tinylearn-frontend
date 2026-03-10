/* eslint-disable */
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ArrowLeft,
  Save,
  Mail,
  Phone,
  Award,
  User,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { BookOpen } from "lucide-react";
import logo from "../../assets/levelup-logo.png";
import {
  useStudentById,
  useParentById,
  useUpdateStudent,
  useUpdateParent,
  useTeacherStudentsProgress,
} from "../../hooks/teacherHooks";

/**
 * Specific User View/Edit Page
 * Allows teachers to view and edit student or parent information
 */
function SpecUser() {
  const navigate = useNavigate();
  const { type, id } = useParams(); // type: 'student' or 'parent', id: user ID
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user data based on type
  const { data: studentData, isLoading: isLoadingStudent } = useStudentById(
    type === "student" ? id : null,
  );
  const { data: parentData, isLoading: isLoadingParent } = useParentById(
    type === "parent" ? id : null,
  );

  // Update mutations
  const updateStudent = useUpdateStudent();
  const updateParent = useUpdateParent();
  const { data: allProgressData } = useTeacherStudentsProgress();

  const isLoading = type === "student" ? isLoadingStudent : isLoadingParent;
  const userData = type === "student" ? studentData?.data : parentData?.data;
  const user = userData;

  const rawProgress = Array.isArray(allProgressData?.data)
    ? allProgressData.data
    : allProgressData?.data?.progress || [];
  const studentProgress =
    type === "student"
      ? rawProgress.filter((p) => p.studentId?._id === id || p.studentId === id)
      : [];

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      if (type === "student") {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          grade: user.grade || "",
          age: user.age || "",
          accountStatus: user.accountStatus || "active",
          isActive: user.isActive !== undefined ? user.isActive : true,
        });
      } else {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: user.phoneNumber || "",
          relationship: user.relationship || "",
          accountStatus: user.accountStatus || "active",
          isActive: user.isActive !== undefined ? user.isActive : true,
        });
      }
    }
  }, [userData, type]);

  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const newValue = inputType === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
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

    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }

    if (type === "student") {
      if (
        formData.age &&
        (isNaN(formData.age) || formData.age < 1 || formData.age > 18)
      ) {
        errors.age = "Age must be between 1 and 18";
      }
    }

    if (type === "parent") {
      if (
        formData.phoneNumber &&
        !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)
      ) {
        errors.phoneNumber = "Please enter a valid phone number";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        accountStatus: formData.accountStatus,
        isActive: formData.isActive,
      };

      if (type === "student") {
        if (formData.grade) submitData.grade = formData.grade;
        if (formData.age) submitData.age = parseInt(formData.age);

        await updateStudent.mutateAsync({ studentId: id, data: submitData });
        setSuccessMessage("Student updated successfully!");
      } else {
        if (formData.phoneNumber)
          submitData.phoneNumber = formData.phoneNumber.trim();
        if (formData.relationship)
          submitData.relationship = formData.relationship.trim();

        await updateParent.mutateAsync({ parentId: id, data: submitData });
        setSuccessMessage("Parent updated successfully!");
      }

      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
      setFormErrors({
        submit:
          error.response?.data?.message || "Update failed. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
    // Reset form data to original user data
    if (user && Object.keys(user).length > 0) {
      if (type === "student") {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          grade: user.grade || "",
          age: user.age || "",
          accountStatus: user.accountStatus || "active",
          isActive: user.isActive !== undefined ? user.isActive : true,
        });
      } else {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phoneNumber: user.phoneNumber || "",
          relationship: user.relationship || "",
          accountStatus: user.accountStatus || "active",
          isActive: user.isActive !== undefined ? user.isActive : true,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-50 rounded-2xl flex items-center justify-center animate-pulse">
              <User className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Loading user...
            </h3>
            <p className="text-slate-600">Please wait</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !user._id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-16">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              User not found
            </h3>
            <p className="text-slate-600 mb-6">
              The user you're looking for doesn't exist
            </p>
            <Button
              onClick={() => navigate("/teacher/users")}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link to="/teacher/users" className="flex items-center gap-3">
              <img
                src={logo}
                alt="TinyLearn"
                className="h-10 w-10 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-slate-900">
                  Teacher Portal
                </h1>
              </div>
            </Link>
            <Button
              variant="outline"
              onClick={() => navigate("/teacher/users")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Message */}
        {successMessage && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-800">
                {successMessage}
              </p>
            </CardContent>
          </Card>
        )}

        {/* User Header Card */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${
                  type === "student"
                    ? "from-blue-400 to-blue-600"
                    : "from-green-400 to-green-600"
                } flex items-center justify-center text-white font-bold text-2xl shadow-md`}
              >
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  {user.firstName} {user.lastName}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    type === "student"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <User className="w-4 h-4" />
                  {type === "student" ? "Student" : "Parent"}
                </span>
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Edit User
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Details Card */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl font-black">
              {isEditing ? "Edit User Information" : "User Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {formErrors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm font-semibold text-red-800">
                    {formErrors.submit}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    First Name *
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          formErrors.firstName
                            ? "border-red-300"
                            : "border-slate-200"
                        }`}
                      />
                      {formErrors.firstName && (
                        <p className="text-xs text-red-600 mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {user.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Last Name *
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          formErrors.lastName
                            ? "border-red-300"
                            : "border-slate-200"
                        }`}
                      />
                      {formErrors.lastName && (
                        <p className="text-xs text-red-600 mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {user.lastName}
                    </p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-slate-900 font-medium">{user.email}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Student-specific fields */}
                {type === "student" && (
                  <>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <Award className="w-4 h-4" />
                        Grade
                      </label>
                      {isEditing ? (
                        <select
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Grade</option>
                          <option value="5th Grade">5th Grade</option>
                          <option value="6th Grade">6th Grade</option>
                          <option value="7th Grade">7th Grade</option>
                          <option value="8th Grade">8th Grade</option>
                        </select>
                      ) : (
                        <p className="text-slate-900 font-medium">
                          {user.grade || "N/A"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Age
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            min="1"
                            max="18"
                            className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              formErrors.age
                                ? "border-red-300"
                                : "border-slate-200"
                            }`}
                          />
                          {formErrors.age && (
                            <p className="text-xs text-red-600 mt-1">
                              {formErrors.age}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-slate-900 font-medium">
                          {user.age || "N/A"}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Parent-specific fields */}
                {type === "parent" && (
                  <>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              formErrors.phoneNumber
                                ? "border-red-300"
                                : "border-slate-200"
                            }`}
                            placeholder="+1234567890"
                          />
                          {formErrors.phoneNumber && (
                            <p className="text-xs text-red-600 mt-1">
                              {formErrors.phoneNumber}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-slate-900 font-medium">
                          {user.phoneNumber || "N/A"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Relationship
                      </label>
                      {isEditing ? (
                        <select
                          name="relationship"
                          value={formData.relationship}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Relationship</option>
                          <option value="mother">Mother</option>
                          <option value="father">Father</option>
                          <option value="guardian">Guardian</option>
                          <option value="grandmother">Grandmother</option>
                          <option value="grandfather">Grandfather</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="text-slate-900 font-medium capitalize">
                          {user.relationship || "N/A"}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Account Status */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Account Status
                  </label>
                  {isEditing ? (
                    <select
                      name="accountStatus"
                      value={formData.accountStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        user.accountStatus === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.accountStatus || "active"}
                    </span>
                  )}
                </div>

                {/* Is Active */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Account Active
                  </label>
                  {isEditing ? (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-slate-700">
                        {formData.isActive ? "Active" : "Inactive"}
                      </span>
                    </label>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        user.isActive !== false
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  )}
                </div>

                {/* Last Login */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Last Login
                  </label>
                  <p className="text-slate-900 font-medium">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                    disabled={updateStudent.isPending || updateParent.isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                    disabled={updateStudent.isPending || updateParent.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateStudent.isPending || updateParent.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Student Progress Details */}
        {type === "student" && !isEditing && (
          <Card className="border border-slate-200 shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Academic Progress & Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentProgress.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">
                    No progress records found for this student.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {studentProgress.map((prog, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${prog.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                        >
                          {prog.status === "completed" ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Clock className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">
                            {prog.lessonId?.title || "Educational Material"}
                          </h4>
                          <p className="text-sm font-semibold text-slate-500 mt-0.5 capitalize">
                            Status: {prog.status}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-2xl font-black ${prog.progressPercentage === 100 ? "text-emerald-500" : "text-amber-500"}`}
                        >
                          {prog.progressPercentage || 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SpecUser;
