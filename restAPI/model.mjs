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

export { connect };
