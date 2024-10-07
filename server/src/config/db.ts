import mongoose from 'mongoose';
import colors from 'colors';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI)
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env'
  );

async function db(): Promise<void> {
  try {
    const conn = await mongoose.connect(MONGO_URI as string, {});
    console.log(colors.cyan.underline(`MongoDB connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(colors.red.underline.bold(`Error: ${error}`));

    process.exit(1);
  }
}

export default db;
