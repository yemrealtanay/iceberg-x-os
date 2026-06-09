import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import router from './routes';

dotenv.config();

const app = express();

const isProd = process.env.NODE_ENV === 'production';
const allowedOrigin = process.env.APP_URL ? process.env.APP_URL.replace(/['"]/g, '').trim() : 'http://localhost:5001';

const allowedOrigins = [
  allowedOrigin,
  'http://localhost:5001',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like same-origin, mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    // Normalize origin by removing trailing slash if present
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    if (
      allowedOrigins.includes(normalizedOrigin) || 
      !isProd ||
      normalizedOrigin.startsWith('http://localhost:') ||
      normalizedOrigin.endsWith('.railway.app')
    ) {
      return callback(null, true);
    } else {
      // Return false instead of throwing an Error to prevent Express 500 Internal Server Error
      return callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json());

// Path to frontend build output
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

// Serve static assets in production/Docker
app.use(express.static(frontendDistPath));

// Mount all API routes
app.use('/api', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// SPA routing fallback for React router
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 404 handler for API or missing assets
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
