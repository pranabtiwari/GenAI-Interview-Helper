import express from "express";
import path from "path";
import user from '../routes/user.routes.js';
import page from '../routes/page.routes.js';
import interView from '../routes/interview.routes.js';
import cors from 'cors';

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: true,
    credentials: true
}));



// ✅ API routes
app.use('/api', user);
app.use('/api', page);
app.use('/api', interView);

export default app;