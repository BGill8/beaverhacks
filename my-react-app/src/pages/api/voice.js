import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post('/api/voice', upload.single('audio'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No audio file uploaded.' });
  }

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: 'whisper-large-v3',
      response_format: 'verbose_json',
    });

    res.json({ transcription: transcription.text });
  } catch (error) {
    console.error('Error during transcription:', error);
    res.status(500).json({ error: 'Failed to transcribe audio.' });
  } finally {
    // Clean up temporary file
    fs.unlink(file.path, (err) => {
      if (err) console.error('Failed to delete temp audio file:', err);
    });
  }
});

export default router;
