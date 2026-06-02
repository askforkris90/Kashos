// Auth Middleware - Protects authenticated routes

class AuthMiddleware {
  /**
   * Check if user is authenticated
   * Redirects to login if not
   */
  static requireAuth() {
    const token = localStorage.getItem('kashos_token');
    if (!token) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  /**
   * Check if user is already logged in
   * Redirects to dashboard if yes
   */
  static requireGuest() {
    const token = localStorage.getItem('kashos_token');
    if (token) {
      window.location.href = 'dashboard.html';
      return false;
    }
    return true;
  }

  /**
   * Get current user data
   */
  static getCurrentUser() {
    try {
      const userJson = localStorage.getItem('kashos_user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  /**
   * Set user data
   */
  static setCurrentUser(user) {
    localStorage.setItem('kashos_user', JSON.stringify(user));
  }

  /**
   * Clear auth data
   */
  static clearAuth() {
    localStorage.removeItem('kashos_token');
    localStorage.removeItem('kashos_user');
    localStorage.removeItem('kashos_remember');
    localStorage.removeItem('kashos_username');
  }

  /**
   * Check if token is expired (mock implementation)
   */
  static isTokenExpired() {
    const token = localStorage.getItem('kashos_token');
    if (!token) return true;
    
    return false;
  }

  /**
   * Get auth headers for API requests
   */
  static getAuthHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('kashos_token')}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Setup global error handler for 401 responses
   */
  static setupGlobalErrorHandler() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      return originalFetch.apply(this, args)
        .then(response => {
          if (response.status === 401) {
            AuthMiddleware.clearAuth();
            window.location.href = 'login.html';
          }
          return response;
        });
    };
  }

  /**
   * Log activity
   */
  static logActivity(action, details = {}) {
    const activity = {
      action,
      timestamp: new Date().toISOString(),
      user: this.getCurrentUser()?.username,
      details
    };
    console.log('Activity:', activity);
  }

  /**
   * Initialize session timeout
   */
  static initSessionTimeout(minutes = 30) {
    let timeoutId = null;
    
    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        if (this.getCurrentUser()) {
          this.clearAuth();
          alert('Your session has expired. Please log in again.');
          window.location.href = 'login.html';
        }
      }, minutes * 60 * 1000);
    };

    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keypress', resetTimeout);
    document.addEventListener('click', resetTimeout);

    resetTimeout();
  }

  /**
   * Check permission (role-based)
   */
  static hasPermission(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      'user': 1,
      'moderator': 2,
      'admin': 3
    };

    const userRole = user.role || 'user';
    return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthMiddleware;
}
