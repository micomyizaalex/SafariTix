const API_BASE_URL = (typeof window !== 'undefined' && window.__API_BASE_URL__) 
  || import.meta.env.VITE_API_BASE_URL 
  || 'http://localhost/Safaritixcode/backend/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('safaritix_token');
  }

  // Set auth token in localStorage
  setToken(token) {
    localStorage.setItem('safaritix_token', token);
  }

  // Remove auth token from localStorage
  removeToken() {
    localStorage.removeItem('safaritix_token');
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      let data;
      try {
        data = await response.json();
      } catch (_) {
        // Non-JSON or empty response
        data = { message: response.statusText };
      }

      if (!response.ok) {
        const message = data?.message || `Request failed (${response.status})`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      const isNetwork = error instanceof TypeError && /fetch|network|Failed to fetch/i.test(error.message);
      const message = isNetwork 
        ? 'Cannot reach API. Check server is running and CORS settings.' 
        : (error.message || 'Something went wrong');
      console.error('API request failed:', message);
      throw new Error(message);
    }
  }

  // Authentication methods
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token if login successful
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async logout() {
    this.removeToken();
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
