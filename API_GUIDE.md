# Kashos OS - Backend API Integration Guide

## 🚀 Overview

The Kashos OS backend API provides comprehensive endpoints for all social discovery, productivity, and media features. The API is built with Express.js and includes mock data for development.

## 📋 Features

### Authentication
- User login and registration
- Token-based authentication
- User profile management

### Social Discovery  
- Friend listing and search
- Friend connections (Hello Friend Protocol)
- Dating match recommendations
- Interest-based filtering

### Productivity
- Task management (CRUD operations)
- Encrypted notes vault
- Project collaboration
- Calendar and event management

### User Settings
- Privacy controls
- Notification preferences
- Appearance customization
- Account management

## 🛠️ Installation & Setup

### Prerequisites
```bash
Node.js >= 14.0.0
npm >= 6.0.0
```

### Install Dependencies
```bash
npm install
```

### Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:3000`

## 📚 API Documentation

Visit `http://localhost:3000/api/docs` for JSON API documentation.

## 🔌 Client Integration

### Using the API Service
```html
<script src="/js/api-service.js"></script>
```

### Quick Examples

**Login**
```javascript
const response = await KashosAPI.login('askforkris90', 'password');
KashosAPI.setToken(response.token);
```

**Get Friends**
```javascript
const friends = await KashosAPI.getFriends();
```

**Create Task**
```javascript
const task = await KashosAPI.createTask('Finish proposal', 'high', '2026-06-10');
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| GET | `/friends` | List friends |
| GET | `/friends/search` | Search friends |
| POST | `/friends/connect` | Connect with friend |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/notes` | List notes |
| POST | `/notes` | Create note |
| GET | `/projects` | List projects |
| POST | `/projects` | Create project |
| GET | `/calendar/events` | List events |
| POST | `/calendar/events` | Create event |
| GET | `/user/profile` | Get profile |
| PUT | `/user/profile` | Update profile |
| GET | `/settings` | Get settings |
| PUT | `/settings` | Update settings |

## 🔒 Security Features

- CORS Enabled
- E2E Encryption for notes
- Bearer token authentication
- File upload validation
- Directory traversal protection

## 🚢 Deployment

### Environment Variables
```bash
PORT=3000
NODE_ENV=production
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Heroku
```bash
heroku create kashos-api
git push heroku main
```

## 📝 Next Steps

1. Database Integration (MongoDB/PostgreSQL)
2. Real JWT Authentication
3. E2E Encryption (TweetNaCl.js)
4. File Storage (AWS S3)
5. WebSocket Support (Real-time)

## 📄 License

MIT License
