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

const textSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
});


const Text = mongoose.model("text", textSchema);

/*
async function geminiResp(data) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Summarize in one sentence smartly: " + data,
  });
  console.log(response.text);

}
*/

async function geminiResp(data) {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: "Summarize in one sentence smartly: " + data }] }],
  });

  const geminiText = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated';
  return geminiText;
}



async function createText(textdata){
/*
  const text = new Text(textdata);
  return await text.save();
  */

    // Get Gemini note
    const note = await geminiResp(textdata.text);

    // Create with note
    const text = new Text({
      text: textdata.text,
      note: note,
    });
  
    return await text.save();
}

export { connect, createText, geminiResp};

