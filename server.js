import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import quizRouter from './api/quiz.js';

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
app.use(bodyParser.json());

// Роуты
app.use('/api/quiz', quizRouter(pool));

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});