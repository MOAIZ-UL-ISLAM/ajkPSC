import express from 'express';
import authRoutes from './routes/auth.routes';
import jobAppRoutes from './routes/jobApplication.routes';
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();
const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());


// test api 
app.get('/test', (req, res) => {
  res.send('App is working');
});
// ------------------------------
// Routes
app.use('/api/auth', authRoutes);
app.use('',jobAppRoutes)



export default app;
