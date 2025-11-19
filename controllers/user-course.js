const Purchase = require("../models/purchase-schema");


exports.getUserPurchasedCourses = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    // 1. Find all purchases of this user
    const purchases = await Purchase.find({ userId }).populate("courseId");

    if (!purchases || purchases.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You have not purchased any courses yet",
        courses: [],
      });
    }

    // 2. Extract course details
    const courses = purchases.map(p => p.courseId);

    return res.status(200).json({
      success: true,
      message: "Purchased courses fetched successfully",
      count: courses.length,
      courses,
    });

  } catch (error) {
    console.error("Get purchased courses error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
