# Quick Start Guide - Kashos Server

## Installation & Running

### Step 1: Install Node.js
Download from: https://nodejs.org/ (LTS version)

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Server
```bash
npm start
```

**Output:**
```
🚀 Kashos Server is running on http://localhost:3000
📚 API Documentation: http://localhost:3000/api/docs
📁 Upload Directory: ./uploads
```

### Step 4: Open Phone App
Open in your browser:
```
http://localhost:3000/public/phone-app.html
```

## Quick Test

### Test 1: Upload a File
1. Open phone app
2. Tap "Upload File"
3. Select any file
4. Tap "Upload to Server"
5. Check "Server Files" section

### Test 2: Send to Cobra.com
1. Tap "Send to Cobra.com"
2. Select your file
3. Enter target path (or leave as "/")
4. Tap "Send"

### Test 3: API Test (Terminal)
```bash
# Check server health
curl http://localhost:3000/health

# List files
curl http://localhost:3000/api/files

# Get API docs
curl http://localhost:3000/api/docs
```

## Directory Structure

```
Kashos/
├── server.js           ← Main server file
├── package.json        ← Dependencies file
├── public/
│   └── phone-app.html  ← Phone app (open in browser)
├── uploads/            ← Your uploaded files (auto-created)
└── README.md
```

## Common Tasks

### Change Port Number
```bash
PORT=8000 npm start
```

### Stop Server
Press `Ctrl + C` in terminal

### Run in Development Mode
```bash
npm run dev
```
(Auto-reloads on file changes)

### View Uploaded Files
Navigate to: `./uploads` folder

## Cobra.com Integration

The server automatically:
1. Accepts file uploads
2. Sends to `https://cobra.com` with metadata
3. Includes upload timestamp
4. Maintains file information

**API Endpoint:** `/api/send-to-cobra`

## Available File Types

✅ HTML, CSS, JavaScript  
✅ Images (PNG, JPEG, GIF)  
✅ JSON, Text  
✅ Max size: 50MB  

## Need Help?

1. **Server won't start?**
   - Check Node.js is installed: `node --version`
   - Check port 3000 is available

2. **File upload fails?**
   - Check file size < 50MB
   - Check file type is supported
   - Check `uploads/` folder exists

3. **Cobra.com upload fails?**
   - Check internet connection
   - Verify cobra.com URL is correct
   - Check server logs for errors

## API Reference Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /health | Server status |
| POST | /api/upload | Upload file |
| POST | /api/send-to-cobra | Send to cobra.com |
| GET | /api/files | List files |
| GET | /files/:filename | Download file |
| DELETE | /api/files/:filename | Delete file |
| GET | /api/docs | API documentation |

---

**Happy uploading! 🚀**
