import express from 'express';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js'
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '10mb' }));  
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({
    origin: 'http://localhost:5173', // Adjusted to match frontend URL
    credentials: true,
}))

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes)

export default app 