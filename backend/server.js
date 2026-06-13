import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seeder.js';

import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import serviceRoutes from './routes/services.js';
import customerRoutes from './routes/customers.js';
import financeRoutes from './routes/finance.js';
import cmsRoutes from './routes/cms.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security and CORS Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for the prototype
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    database: global.isMockDB ? 'JSON Fallback' : 'MongoDB Atlas',
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/reports', reportRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('💥 Server error details:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'An internal server error occurred' 
  });
});

// Boot the Server
const startServer = async () => {
  // Connect to Database
  await connectDB();
  
  // Seed Database (MongoDB or JSON)
  await seedDatabase();

  app.listen(PORT, () => {
    console.log('\x1b[35m%s\x1b[0m', `🚀 RUSTIK SERVER RUNNING ON PORT ${PORT}`);
    console.log('\x1b[36m%s\x1b[0m', `👉 API Health: http://localhost:${PORT}/api/health`);
  });
};

startServer();
