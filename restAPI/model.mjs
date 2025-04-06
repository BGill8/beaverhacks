import mongoose from 'mongoose';
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
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

async function geminiResp(data) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Summarize in detailed notes: " + data,
  });
  console.log(response.data);
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
  geminiResp(text)
  return await text.save();
}

export { connect, createText, geminiResp};

