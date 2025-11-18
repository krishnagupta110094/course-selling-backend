const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URL;

    await mongoose.connect(dbURI);

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Stop server if DB fails
  }
};

module.exports = connectDB;
