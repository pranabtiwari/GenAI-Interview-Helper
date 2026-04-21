import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import user from '../routes/user.routes.js';
import page from '../routes/page.routes.js';
import interView from '../routes/interview.routes.js';
import cors from 'cors';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");


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

app.use(express.static(publicDir));

app.get((req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
        return next();
    }

    return res.sendFile(path.join(publicDir, "index.html"));
});

export default app;