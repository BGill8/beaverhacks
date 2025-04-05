// model.mjs
import mongoose from 'mongoose';
import 'dotenv/config';

let connection = undefined;

/**
 * This function connects to the MongoDB server.
 */
async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING);
    connection = mongoose.connection;
    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (err) {
    console.log(err);
    throw Error(`Could not connect to MongoDB ${err.message}`);
  }
}

// Define the schema for your voice data
const voiceSchema = new mongoose.Schema({
  text: String,
});

// Create a model from the schema
const VoiceData = mongoose.model("VoiceData", voiceSchema);

async function create_voice_text(voicedata) {
  const voice_text = new VoiceData(voicedata);
  return await voice_text.save();
}

export { connect, create_voice_text, VoiceData };
