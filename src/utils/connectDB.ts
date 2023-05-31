import mongoose from 'mongoose';
import config from 'config';

const userName = config.get('dbUserName');
const dbPass = config.get('dbPass');
const dbHost = config.get('dbHost');
const dbPort = config.get('dbPort');
const dbName = config.get('dbName');
let dbUrl: string;

const connectDB = async () => {
  try {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'staging'
    ) {
      dbUrl = `mongodb://${dbHost}:${dbPort}/${dbName}`;
    } else {
      dbUrl = `mongodb://${userName}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
    }

    await mongoose.connect(dbUrl);
    console.log('Database connected...');
  } catch (error: unknown) {
    process.stdout.write((error as { message: string })?.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
