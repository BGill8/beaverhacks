import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/api/summarize', upload.single('file'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  if (file.mimetype !== 'text/plain') {
    await fs.unlink(file.path); // Clean up non-txt file
    return res.status(400).json({ error: 'Only .txt files are supported.' });
  }

  try {
    const content = await fs.readFile(file.path, 'utf-8');

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(`Summarize the following notes:\n\n${content}`);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary });
  } catch (err) {
    console.error('Error summarizing file:', err);
    res.status(500).json({ error: 'Failed to summarize file.' });
  } finally {
    await fs.unlink(file.path); // Clean up uploaded file
  }
});

export default router;
