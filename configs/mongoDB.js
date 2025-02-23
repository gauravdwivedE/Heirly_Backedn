const mongoose = require('mongoose');
const chalk = require('chalk');

async function connectDB() {
  // Check if the environment variable is loaded correctly
  
  if (!process.env.MONGO_DB_URI) {
    console.log(chalk.red('MongoDB URI is not defined! Please check your environment variables.'));
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(chalk.green("MongoDBConnection: Connected to the database"));
  } catch (err) {
    console.log(chalk.red(err));
  }
}

module.exports = connectDB;
