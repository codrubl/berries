const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB conectat: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Eroare conexiune MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;