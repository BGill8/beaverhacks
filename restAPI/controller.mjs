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







