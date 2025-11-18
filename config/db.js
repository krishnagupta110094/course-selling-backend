const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbURI =
      "mongodb+srv://krsnagupta79822:Ehgyukfyk786jyyg57hk@cluster0.q2775xw.mongodb.net/CourseSellingDB"

    await mongoose.connect(dbURI);

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Stop server if DB fails
  }
};

module.exports = connectDB;
