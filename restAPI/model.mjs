/*
import mongoose from 'mongoose';
import 'dotenv/config';

let connection = undefined;

async function connect() {
  try {
    console.log("MongoDB connection string:", process.env.MONGODB_CONNECT_STRING); // Add this line
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING);
    connection = mongoose.connection;
    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (err) {
    console.log(err);
    throw Error(`Could not connect to MongoDB ${err.message}`);
  }
}


const textSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});


const Text = mongoose.model("text", textSchema);


async function createText(textdata){

  const text = new Text(textdata);
  return await text.save();
}

export { connect, createText};
*/

import mongoose from 'mongoose';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI;

async function connect() {
  try {
    console.log("MongoDB connection string:", process.env.MONGODB_CONNECT_STRING);
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING);
    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw new Error(`Could not connect to MongoDB: ${err.message}`);
  }
}

async function initializeGemini(){
    try{
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log("Gemini Initialized");
    }catch(error){
        console.error("Gemini Initialization error:", error);
        throw new Error(`Could not initialize Gemini: ${error.message}`);
    }
}

// Define your Text Schema
const textSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  processedNotes: {
    type: String,
    required: false,
  },
});

const Text = mongoose.model("Text", textSchema);

// Function to process text with Gemini AI
async function processTextWithGeminiAI(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});
    const prompt = `Turn the following story into notes: ${text}`;
    const result = await model.generateContent(prompt);
    
    const response = await result.response;
    const notes = response.text(); // Assuming it's a function that returns the processed notes
    console.log("Gemini AI processed notes:", notes); // Print the output of the AI in the console
    return notes;
  } catch (error) {
    console.error("Gemini AI processing error:", error);
    return null; // Or throw an error, depending on your error-handling strategy
  }
}

// Function to create and save text to the database after processing it with Gemini AI
async function createText(textdata) {
  try {
    const { text } = textdata;

    // Process the text with Gemini AI
    const processedNotes = await processTextWithGeminiAI(text);

    // Print the processed notes before saving to database
    console.log("Processed Notes to be saved:", processedNotes);

    // Save the original text and processed notes to the database
    const textEntry = new Text({
      text,
      processedNotes,
    });

    return await textEntry.save();
  } catch (error) {
    console.error("Error creating text:", error);
    throw new Error("Text creation failed");
  }
}

export { connect, createText, initializeGemini };
