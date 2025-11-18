const Course = require("../models/course-schema");
const Purchase = require("../models/purchase-schema");

exports.buyCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const courseId = req.params.id;

    // 1. Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2. Prevent duplicate purchase
    const alreadyPurchased = await Purchase.findOne({ userId, courseId });

    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course",
      });
    }

    // 3. Create purchase record
    const purchase = await Purchase.create({
      userId,
      courseId,
    });

    return res.status(201).json({
      success: true,
      message: "Course purchased successfully",
      purchase,
    });

  } catch (error) {
    console.error("Buy course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      count: courses.length,
      courses,
    });

  } catch (error) {
    console.error("Get all courses error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

