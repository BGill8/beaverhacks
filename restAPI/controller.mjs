import 'dotenv/config';
import express from 'express'; 
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import * as exercises from './exercise_model.mjs';

const app = express();
app.use(express.json())

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    await exercises.connect(false)
    console.log(`Server listening on port ${PORT}...`);
});


//function writes
