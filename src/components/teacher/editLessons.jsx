import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X, Plus, Trash2, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { useUpdateLesson, useLessonById } from '../../hooks/teacherHooks';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Edit Lesson Modal Component
 * Form to edit an existing lesson with chapters
 */
function EditLesson({ isOpen, onClose, lesson }) {
  const queryClient = useQueryClient();
  const updateLesson = useUpdateLesson();
  const { data: lessonData, isLoading } = useLessonById(lesson?._id || lesson?.id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    ageGroup: '',
    duration: '',
    videoUrl: '',
    isPublished: true,
    chapters: [{ chapter: '', chapterContent: '' }]
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Populate form when lesson data is loaded
  useEffect(() => {
    if (lessonData?.data && isOpen) {
      const lesson = lessonData.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        category: lesson.category || '',
        difficulty: lesson.difficulty || 'beginner',
        ageGroup: lesson.ageGroup || '',
        duration: lesson.duration?.toString() || '',
        videoUrl: lesson.videoUrl || '',
        isPublished: lesson.isActive !== false,
        chapters: lesson.content && lesson.content.length > 0 
          ? lesson.content.map(ch => ({
              chapter: ch.chapter || '',
              chapterContent: ch.chapterContent || ''
            }))
          : [{ chapter: '', chapterContent: '' }]
      });
      
      if (lesson.imageUrl) {
        setImagePreview(lesson.imageUrl);
      }
      setSelectedImage(null);
    }
  }, [lessonData, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChapterChange = (index, field, value) => {
    const updatedChapters = [...formData.chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      chapters: updatedChapters
    }));

    // Clear chapter errors
    if (formErrors[`chapter-${index}`]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`chapter-${index}`];
        return newErrors;
      });
    }
  };

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, { chapter: '', chapterContent: '' }]
    }));
  };

  const removeChapter = (index) => {
    if (formData.chapters.length > 1) {
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }

      setSelectedImage(file);
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    if (!formData.ageGroup.trim()) {
      errors.ageGroup = 'Age group is required';
    }

    // Validate chapters
    formData.chapters.forEach((chapter, index) => {
      if (!chapter.chapter.trim()) {
        errors[`chapter-${index}`] = 'Chapter name is required';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!lesson?._id && !lesson?.id) {
      setFormErrors({ submit: 'Lesson ID is required' });
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title.trim());
      if (formData.description.trim()) {
        formDataToSend.append('description', formData.description.trim());
      }
      formDataToSend.append('category', formData.category);
      formDataToSend.append('difficulty', formData.difficulty);
      formDataToSend.append('ageGroup', formData.ageGroup.trim());
      
      if (formData.duration) {
        formDataToSend.append('duration', parseInt(formData.duration));
      }
      if (formData.videoUrl) {
        formDataToSend.append('videoUrl', formData.videoUrl.trim());
      }
      if (formData.isPublished !== undefined) {
        formDataToSend.append('isActive', formData.isPublished);
      }

      // Add content (chapters) as JSON string
      const content = formData.chapters.map(ch => ({
        chapter: ch.chapter.trim(),
        chapterContent: ch.chapterContent.trim() || undefined,
        isSeen: false // Default to false, not editable by teachers
      }));
      formDataToSend.append('content', JSON.stringify(content));

      // Add image file if selected, otherwise keep existing imageUrl
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      } else if (imagePreview && !imagePreview.startsWith('data:')) {
        // Keep existing image URL if no new file selected
        formDataToSend.append('imageUrl', imagePreview);
      }
      
      await updateLesson.mutateAsync({
        lessonId: lesson._id || lesson.id,
        lessonData: formDataToSend
      });
      
      setSuccessMessage('Lesson updated successfully!');

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['teacher-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['lesson', lesson._id || lesson.id] });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Update error:', error);
      setFormErrors({ submit: error.response?.data?.message || 'Update failed. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: 'beginner',
      ageGroup: '',
      duration: '',
      videoUrl: '',
      isPublished: true,
      chapters: [{ chapter: '', chapterContent: '' }]
    });
    setSelectedImage(null);
    setImagePreview(null);
    setFormErrors({});
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-2xl">
          <CardContent className="p-6 text-center">
            <p className="text-slate-600">Loading lesson data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between sticky top-0 bg-white z-10">
          <CardTitle className="text-2xl font-black flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Edit Lesson
          </CardTitle>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm font-semibold text-green-800">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {formErrors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm font-semibold text-red-800">{formErrors.submit}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.title ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="e.g., Introduction to Algebra"
                />
                {formErrors.title && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description of the lesson..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.category ? 'border-red-300' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="math">Math</option>
                    <option value="reading">Reading</option>
                    <option value="science">Science</option>
                    <option value="art">Art</option>
                    <option value="music">Music</option>
                    <option value="physical">Physical</option>
                    <option value="social">Social</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Age Group *</label>
                  <input
                    type="text"
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.ageGroup ? 'border-red-300' : 'border-slate-200'
                    }`}
                    placeholder="e.g., 5-7 years"
                  />
                  {formErrors.ageGroup && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.ageGroup}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    max="300"
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Lesson Image</label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload-edit"
                    />
                    <label
                      htmlFor="image-upload-edit"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Click to upload image</p>
                      <p className="text-xs text-slate-500">JPEG, PNG, GIF, or WebP (Max 5MB)</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {formErrors.image && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.image}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Video URL</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/video.mp4"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-bold text-slate-700">Publish immediately</span>
                </label>
              </div>
            </div>

            {/* Chapters Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Chapters *</h3>
                <Button
                  type="button"
                  onClick={addChapter}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Chapter
                </Button>
              </div>

              <div className="space-y-3">
                {formData.chapters.map((chapter, index) => (
                  <div key={index} className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-bold text-slate-700">
                          Chapter {index + 1} *
                        </label>
                        {formData.chapters.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeChapter(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={chapter.chapter}
                          onChange={(e) => handleChapterChange(index, 'chapter', e.target.value)}
                          className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            formErrors[`chapter-${index}`] ? 'border-red-300' : 'border-slate-200'
                          }`}
                          placeholder={`Chapter ${index + 1} title...`}
                        />
                        {formErrors[`chapter-${index}`] && (
                          <p className="text-xs text-red-600 mt-1">{formErrors[`chapter-${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Chapter Content
                        </label>
                        <textarea
                          value={chapter.chapterContent}
                          onChange={(e) => handleChapterChange(index, 'chapterContent', e.target.value)}
                          rows="4"
                          className="w-full px-4 py-2 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Enter the content for Chapter ${index + 1}...`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="flex-1"
                disabled={updateLesson.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-purple-600 hover:to-indigo-600"
                disabled={updateLesson.isPending}
              >
                {updateLesson.isPending ? 'Updating...' : 'Update Lesson'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditLesson;

