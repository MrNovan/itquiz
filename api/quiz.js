import express from 'express';

export default (pool) => {
  const router = express.Router();

  // Получение категорий
  router.get('/categories', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY id');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Получение уровней сложности
  router.get('/levels', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM levels ORDER BY order_index');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Получение вопросов по категории и уровню
  router.get('/questions', async (req, res) => {
    const { categoryId, levelId } = req.query;
    try {
      const result = await pool.query(
        'SELECT * FROM questions WHERE category_id = $1 AND level_id = $2',
        [categoryId, levelId]
      );
      
      // Обработка и перемешивание вариантов ответов
      const questions = result.rows.map(question => ({
        ...question,
        options: Array.isArray(question.options) ? question.options : [],
        explanation: question.explanation || ''
      }));
      
      // Логика перемешивания вариантов ответов
      const shuffledQuestions = questions.map(question => {
        const originalOptions = [...question.options];
        const correctOption = originalOptions[question.correct_answer];
        
        // Создаем массив индексов и перемешиваем
        const indices = Array.from({ length: originalOptions.length }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // Перемешиваем варианты
        const shuffledOptions = indices.map(index => originalOptions[index]);
        const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctOption);
        
        return {
          ...question,
          options: shuffledOptions,
          correct_answer: newCorrectIndex
        };
      });
      
      res.json(shuffledQuestions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Получение всех вопросов (для админки)
  router.get('/all-questions', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM questions ORDER BY created_at DESC');
      const questions = result.rows.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : [],
        explanation: q.explanation || ''
      }));
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Создание вопроса
  router.post('/questions', async (req, res) => {
    const { category_id, level_id, text, options, correct_answer, explanation } = req.body;

    // Проверка обязательных полей
    if (!category_id || !level_id || !text || !options || correct_answer === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Преобразуем options в JSON и correct_answer в число
      const optionsJson = JSON.stringify(options);
      const correctAnswerInt = parseInt(correct_answer);

      await pool.query(
        `INSERT INTO questions (category_id, level_id, text, options, correct_answer, explanation)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [category_id, level_id, text, optionsJson, correctAnswerInt, explanation || null]
      );
      res.status(201).json({ message: 'Question created' });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Обновление вопроса
  router.put('/questions/:id', async (req, res) => {
    const { id } = req.params;
    const { category_id, level_id, text, options, correct_answer, explanation } = req.body;
    try {
      // Преобразуем options в JSON только если это массив
      const optionsJson = Array.isArray(options) ? JSON.stringify(options) : options;
      const correctAnswerInt = parseInt(correct_answer);

      await pool.query(
        `UPDATE questions SET
          category_id = $1,
          level_id = $2,
          text = $3,
          options = $4,
          correct_answer = $5,
          explanation = $6
         WHERE id = $7`,
        [category_id, level_id, text, optionsJson, correctAnswerInt, explanation || null, id]
      );
      res.json({ message: 'Question updated' });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Удаление вопроса
  router.delete('/questions/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query('DELETE FROM questions WHERE id = $1', [id]);
      res.json({ message: 'Question deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Создание категории
  router.post('/categories', async (req, res) => {
    const { id, title, description } = req.body;
    try {
      await pool.query(
        `INSERT INTO categories (id, title, description)
         VALUES ($1, $2, $3)`,
        [id, title, description]
      );
      res.status(201).json({ message: 'Category created' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Обновление категории
  router.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
      await pool.query(
        `UPDATE categories SET title = $1, description = $2 WHERE id = $3`,
        [title, description, id]
      );
      res.json({ message: 'Category updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Удаление категории
  router.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Проверка использования категории
      const checkResult = await pool.query(
        'SELECT id FROM questions WHERE category_id = $1 LIMIT 1',
        [id]
      );
      
      if (checkResult.rows.length > 0) {
        return res.status(400).json({ error: 'Cannot delete category used in questions' });
      }

      await pool.query('DELETE FROM categories WHERE id = $1', [id]);
      res.json({ message: 'Category deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  return router;
};