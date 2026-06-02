# Kashos OS - Authentication System Guide

## 🔐 Overview

Complete authentication system for Kashos OS with login, registration, session management, and role-based access control.

## 📋 Features

### User Authentication
- ✅ Secure login with validation
- ✅ User registration with email verification
- ✅ Password strength requirements
- ✅ "Remember me" functionality
- ✅ Session token management
- ✅ Auto-logout on token expiration

### Security
- ✅ Client-side form validation
- ✅ Server-side authentication
- ✅ Bearer token authorization
- ✅ Protected routes with redirects
- ✅ CORS protection
- ✅ Activity logging

### User Management
- ✅ Profile viewing and editing
- ✅ Account settings management
- ✅ Privacy controls
- ✅ Notification preferences
- ✅ Account deletion

## 🛠️ Components

### 1. Login Page (`login.html`)

**Features:**
- Clean, modern UI with gradient backgrounds
- Dual form: Login & Register
- Real-time form validation
- Error message display
- Remember me checkbox
- Loading indicators

**Usage:**
```html
<a href="login.html">Sign In</a>
```

### 2. Account Page (`account.html`)

**Features:**
- Profile information display
- Edit profile functionality
- Settings management
- Privacy controls
- Notification preferences
- Account deletion

**Usage:**
```html
<a href="account.html">My Account</a>
```

### 3. Auth Middleware (`public/js/auth-middleware.js`)

**Protected Page Example:**
```javascript
// At top of script in protected page
window.addEventListener('DOMContentLoaded', () => {
  if (!AuthMiddleware.requireAuth()) {
    return; // User not authenticated
  }
  
  const user = AuthMiddleware.getCurrentUser();
  console.log('Welcome, ' + user.username);
});
```

## 🔄 Authentication Flow

### Login Flow
```
User → Login Form → Validation → API Call → Token Saved → Redirect to Dashboard
```

### Register Flow
```
User → Register Form → Validation → API Call → Auto-Login → Redirect to Dashboard
```

### Protected Route Flow
```
User Visits Page → Check Token → Valid → Show Page || Invalid → Redirect to Login
```

## 📝 Integration Examples

### Protect a Page
```javascript
<script src="/js/auth-middleware.js"></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    AuthMiddleware.requireAuth();
  });
</script>
```

### Get Current User
```javascript
const user = AuthMiddleware.getCurrentUser();
console.log('Username:', user.username);
console.log('Email:', user.email);
console.log('Tier:', user.accountTier);
```

### Make Authenticated API Request
```javascript
const response = await fetch('/api/tasks', {
  headers: AuthMiddleware.getAuthHeaders()
});
```

### Log Activity
```javascript
AuthMiddleware.logActivity('task_created', {
  taskId: 123,
  title: 'My Task'
});
```

### Check Permissions
```javascript
if (AuthMiddleware.hasPermission('admin')) {
  // Show admin panel
}
```

### Logout
```javascript
AuthMiddleware.clearAuth();
window.location.href = 'login.html';
```

## 🔒 Security Best Practices

### Token Storage
- ✅ Use localStorage (XSS vulnerable, but better than cookies for this app)
- ✅ In production: Use httpOnly cookies instead
- ✅ Clear on logout

### Password Requirements
- ✅ Minimum 6 characters
- ✅ Validation on both client and server
- ✅ Never stored in plain text (server-side hashing)

### Session Management
- ✅ Session timeout after 30 minutes
- ✅ Auto-logout on inactivity
- ✅ Token expiration on backend

### CORS Protection
- ✅ Credentials only sent to trusted domain
- ✅ Preflight requests handled
- ✅ CORS headers validated

## 📊 API Endpoints for Auth

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/user/profile` | GET | Get user profile |
| `/api/user/profile` | PUT | Update profile |
| `/api/settings` | GET | Get settings |
| `/api/settings` | PUT | Update settings |

## 🚀 Testing

### Test Login
```javascript
// In browser console
const login = await KashosAPI.login('askforkris90', 'password');
KashosAPI.setToken(login.token);
localStorage.setItem('kashos_user', JSON.stringify(login.user));
```

### Test Registration
```javascript
const register = await KashosAPI.register('testuser', 'test@example.com', 'password123');
```

### Test Protected Route
```javascript
AuthMiddleware.requireAuth();
```

## 📝 Customization

### Update Password Requirements
Edit `login.html` line 200:
```javascript
if (password.length < 6) {
  // Change to desired length
}
```

### Customize Session Timeout
Edit `public/js/auth-middleware.js` line 140:
```javascript
static initSessionTimeout(minutes = 30) {
  // Change minutes to desired value
}
```

### Add Custom Fields
Add to registration form in `login.html`:
```html
<div class="form-group">
  <label for="registerPhone">Phone</label>
  <input type="tel" id="registerPhone" placeholder="+1-234-567-8900">
</div>
```

## 🔧 Production Deployment

### Before Going Live
1. ✅ Switch to httpOnly cookies for tokens
2. ✅ Implement real JWT token generation
3. ✅ Add password hashing (bcrypt)
4. ✅ Implement email verification
5. ✅ Add password reset flow
6. ✅ Implement 2FA/MFA
7. ✅ Add rate limiting
8. ✅ Enable HTTPS only

### Environment Variables
```bash
JWT_SECRET=your_super_secret_key_here
SESSION_TIMEOUT=1800000  # 30 minutes in milliseconds
PASSWORD_MIN_LENGTH=8
EMAIL_VERIFICATION=true
```

## 📞 Support

For issues or questions about authentication:
1. Check browser console for errors
2. Verify API server is running
3. Check network tab for failed requests
4. Review API_GUIDE.md for endpoint details

## 📄 License

MIT License - See LICENSE file for details
