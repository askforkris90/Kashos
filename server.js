const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup file upload directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        // Allow specific file types
        const allowedMimes = [
            'text/html',
            'application/javascript',
            'text/css',
            'image/png',
            'image/jpeg',
            'image/gif',
            'application/json',
            'text/plain'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.mimetype}`));
        }
    }
});

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date() });
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadTime: new Date(),
        path: `/files/${req.file.filename}`,
        url: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
    };

    res.json({
        success: true,
        message: 'File uploaded successfully',
        file: fileInfo
    });
});

// Send file to cobra.com endpoint
app.post('/api/send-to-cobra', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const { targetPath = '/' } = req.body;
        const cobraUrl = `https://cobra.com${targetPath}`;

        // Read the file
        const fileBuffer = fs.readFileSync(req.file.path);

        // Create form data to send to cobra.com
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('file', fileBuffer, req.file.originalname);
        formData.append('metadata', JSON.stringify({
            uploadedFrom: 'kashos-server',
            timestamp: new Date(),
            originalName: req.file.originalname
        }));

        // Send to cobra.com
        const response = await axios.post(cobraUrl, formData, {
            headers: formData.getHeaders(),
            timeout: 10000
        });

        // Delete local file after successful upload
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: 'File sent to cobra.com successfully',
            cobraResponse: response.data,
            file: {
                originalName: req.file.originalname,
                size: req.file.size,
                sentTo: cobraUrl,
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error('Error sending to cobra.com:', error.message);
        
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            error: 'Failed to send file to cobra.com',
            details: error.message
        });
    }
});

// Get list of uploaded files
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir).map(filename => {
            const filepath = path.join(uploadDir, filename);
            const stats = fs.statSync(filepath);
            
            return {
                filename: filename,
                size: stats.size,
                uploadedAt: stats.birthtime,
                url: `/files/${filename}`
            };
        });

        res.json({
            success: true,
            totalFiles: files.length,
            files: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve files',
            details: error.message
        });
    }
});

// Download file
app.get('/files/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);

        // Security: prevent directory traversal
        if (!filepath.startsWith(uploadDir)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if file exists
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(filepath);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to download file',
            details: error.message
        });
    }
});

// Delete file
app.delete('/api/files/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(uploadDir, filename);

        // Security: prevent directory traversal
        if (!filepath.startsWith(uploadDir)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Check if file exists
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.unlinkSync(filepath);

        res.json({
            success: true,
            message: `File ${filename} deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete file',
            details: error.message
        });
    }
});

// Serve static files (phone app)
app.use(express.static(path.join(__dirname, 'public')));

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        name: 'Kashos Server API',
        version: '1.0.0',
        description: 'File hosting and management server with cobra.com integration',
        endpoints: {
            health: {
                method: 'GET',
                path: '/health',
                description: 'Check server health status'
            },
            upload: {
                method: 'POST',
                path: '/api/upload',
                description: 'Upload a file to server',
                params: { file: 'multipart file' }
            },
            sendToCobra: {
                method: 'POST',
                path: '/api/send-to-cobra',
                description: 'Send file to cobra.com',
                params: {
                    file: 'multipart file',
                    targetPath: 'optional target path on cobra.com'
                }
            },
            listFiles: {
                method: 'GET',
                path: '/api/files',
                description: 'Get list of all uploaded files'
            },
            downloadFile: {
                method: 'GET',
                path: '/files/:filename',
                description: 'Download a file'
            },
            deleteFile: {
                method: 'DELETE',
                path: '/api/files/:filename',
                description: 'Delete a file'
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Kashos Server is running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
    console.log(`📁 Upload Directory: ${uploadDir}\n`);
});

module.exports = app;
