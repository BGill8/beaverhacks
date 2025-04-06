
import express from 'express'; 
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import * as model from './model.mjs'; 

const app = express();
//const PORT = process.env.PORT || 5174;
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, async () => {
  try {
    await model.connect();
    console.log(`Server listening on port ${PORT}...`);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit if connection fails
  }
});


// POST route to save text
app.post('/text',
  body('text').notEmpty().withMessage('Text is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newText = await model.createText(req.body); 
    res.status(201).json(newText); 
  })
);

app.post('/gemini-process',
  body('dataToSummarize').notEmpty().withMessage('Data to summarize is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newText = await model.geminiResp(dataToSummarize); 
    res.status(201).json(newText); 
  })
);

