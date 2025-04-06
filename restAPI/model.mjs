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
