import 'dotenv/config';
import express from 'express';
import { body, validationResult, param } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { connect, create_voice_text, VoiceData } from './model.mjs';

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await connect();
  console.log(`Server listening on port ${PORT}...`);
});


// POST /voice: Create a new voice data entry
app.post(
  '/voice',
  [body('text').notEmpty().withMessage('Text is required')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;
    const voiceData = await create_voice_text({ text });
    res.status(201).json(voiceData);
  })
);





// GET /voice/:id: Retrieve a voice data entry by ID
app.get(
  '/voice/:id',
  [param('id').isMongoId().withMessage('Invalid Voice ID')],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const voiceData = await VoiceData.findById(req.params.id);
    if (!voiceData) {
      return res.status(404).json({ message: 'Voice data not found' });
    }
    res.json(voiceData);
  })
);



// /api/voice.js (or your backend API file)
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs/promises'; //For file system operations.
import formidable from 'formidable'; //For handling form data, including files.

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle form data
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);
    const audioFilePath = files.audio[0].filepath;
    const audioBuffer = await fs.readFile(audioFilePath);

    // 1. Convert audio to text (using a speech-to-text service)
    // This is a placeholder. You'll need to integrate with a speech-to-text API.
    const transcribedText = await transcribeAudio(audioBuffer);

    if(!transcribedText){
      return res.status(500).json({error: "Audio transcription failed."})
    }

    // 2. Send text to Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); //Store your API key in an environment variable.
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Respond to the following audio transcription: ${transcribedText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. Send Gemini's response back to the frontend
    res.status(200).json({ message: text });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Failed to process audio.' });
  }
}

async function transcribeAudio(audioBuffer) {
    //Implement your audio to text service here.
    //For example, you could use Google Cloud Speech-to-Text, or another service.
    //This example returns null, so it needs to be replaced.
    return null;
}







