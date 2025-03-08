import express from "express";
import authRoutes from "./routes/auth.routes";
import jobAppRoutes from "./routes/jobApplication.routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get("/test", (req, res) => {
  res.send("app is working ");
});

app.use(
  cors({
    origin: 'http://localhost:3000', //   process.env.FRONTEND_URL,  --------> for production
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


const baseURL =  "/api/v1/";



app.use(express.json());
app.use(`${baseURL}auth`, authRoutes);
app.use(`${baseURL}`, jobAppRoutes);

export default app;
