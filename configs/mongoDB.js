const mongoose = require('mongoose')
const chalk = require('chalk')

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log(chalk.green("MongoDBConnection: Connected to the database"));
    
  } catch (err) {
    console.log(chalk.red(err));
  }
}

module.exports = connectDB