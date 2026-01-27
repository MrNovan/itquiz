import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';
import quizRouter from './api/quiz.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Подключение к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
const whitelistEnv = process.env.CORS_WHITELIST || '';
const whitelist = whitelistEnv
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
if (whitelist.length === 0) {
  whitelist.push('http://localhost:5173', 'http://localhost:4173');
}
const corsOptions = {
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (same-origin, например из dist на том же сервере)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(bodyParser.json());

// API роуты с CORS
app.use('/api/quiz', cors(corsOptions), quizRouter(pool));

// Статические файлы из dist (без CORS)
app.use(express.static(path.join(__dirname, 'dist')));

// Все остальные запросы отправляем на index.html (для React Router)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
