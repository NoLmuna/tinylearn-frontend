/**
 * Enhanced API Service for TinyLearn Frontend
 * Provides centralized API communication with error handling and caching
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Make HTTP request with enhanced error handling
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      let data;
      
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      // Normalize response format
      return {
        success: data.success ?? true,
        data: data.data ?? data,
        message: data.message || 'Success'
      };
    } catch (error) {
      // Network or parsing errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      throw error;
    }
  }

  /**
   * GET request with optional caching
   */
  async get(endpoint, useCache = false) {
    if (useCache && this.cache.has(endpoint)) {
      const cached = this.cache.get(endpoint);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(endpoint);
    }

    const data = await this.request(endpoint);
    
    if (useCache) {
      this.cache.set(endpoint, {
        data,
        timestamp: Date.now()
      });
    }

    return data;
  }

  /**
   * POST request
   */
  async post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Token management
   */
  getToken() {
    return localStorage.getItem('tinylearn_token');
  }

  setToken(token) {
    localStorage.setItem('tinylearn_token', token);
  }

  removeToken() {
    localStorage.removeItem('tinylearn_token');
    this.clearCache();
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  // === AUTH ENDPOINTS ===
  async login(credentials) {
    const response = await this.post('/users/login', credentials);
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout() {
    this.removeToken();
    return { success: true, message: 'Logged out successfully' };
  }

  async getProfile() {
    return this.get('/users/profile', true); // Cache profile data
  }

  // === USER MANAGEMENT ===
  async createUser(userData) {
    return this.post('/users/create', userData);
  }

  async getUsers(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    return this.get(endpoint);
  }

  async updateUser(userId, userData) {
    return this.put(`/users/${userId}`, userData);
  }

  async deleteUser(userId) {
    return this.delete(`/users/${userId}`);
  }

  async updateUserStatus(userId, status) {
    return this.put(`/users/${userId}/status`, { accountStatus: status });
  }

  // === LESSONS ===
  async getLessons(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = `/lessons${queryString ? `?${queryString}` : ''}`;
    return this.get(endpoint, true);
  }

  async getLesson(lessonId) {
    return this.get(`/lessons/${lessonId}`, true);
  }

  async createLesson(lessonData) {
    return this.post('/lessons', lessonData);
  }

  async updateLesson(lessonId, lessonData) {
    return this.put(`/lessons/${lessonId}`, lessonData);
  }

  async deleteLesson(lessonId) {
    return this.delete(`/lessons/${lessonId}`);
  }

  // === PROGRESS ===
  async getProgress(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = `/progress${queryString ? `?${queryString}` : ''}`;
    return this.get(endpoint);
  }

  async updateProgress(progressData) {
    return this.post('/progress', progressData);
  }

  async getStudentProgress(studentId) {
    return this.get(`/progress/student/${studentId}`, true);
  }

  // === ASSIGNMENTS ===
  async getAssignments(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = `/assignments${queryString ? `?${queryString}` : ''}`;
    return this.get(endpoint);
  }

  async getAssignment(assignmentId) {
    return this.get(`/assignments/${assignmentId}`);
  }

  async createAssignment(assignmentData) {
    return this.post('/assignments', assignmentData);
  }

  async updateAssignment(assignmentId, assignmentData) {
    return this.put(`/assignments/${assignmentId}`, assignmentData);
  }

  async deleteAssignment(assignmentId) {
    return this.delete(`/assignments/${assignmentId}`);
  }

  // === SUBMISSIONS ===
  async getSubmissions(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = `/submissions${queryString ? `?${queryString}` : ''}`;
    return this.get(endpoint);
  }

  async createSubmission(submissionData) {
    return this.post('/submissions', submissionData);
  }

  async updateSubmission(submissionId, submissionData) {
    return this.put(`/submissions/${submissionId}`, submissionData);
  }

  async gradeSubmission(submissionId, gradeData) {
    return this.put(`/submissions/${submissionId}/grade`, gradeData);
  }

  // === MESSAGES ===
  async getMessages(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = `/messages${queryString ? `?${queryString}` : ''}`;
    return this.get(endpoint);
  }

  async sendMessage(messageData) {
    return this.post('/messages', messageData);
  }

  async markMessageAsRead(messageId) {
    return this.put(`/messages/${messageId}/read`);
  }

  async deleteMessage(messageId) {
    return this.delete(`/messages/${messageId}`);
  }

  // === PARENT-STUDENT RELATIONSHIPS ===
  async getParentStudents(parentId) {
    return this.get(`/users/${parentId}/students`, true);
  }

  async linkParentStudent(parentId, studentId, relationship = 'guardian') {
    return this.post('/users/parent-student-link', {
      parentId,
      studentId,
      relationship
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export both class and instance for flexibility
export { ApiService };
export default apiService;
