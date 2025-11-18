const Course = require("../models/course-schema");
const z = require("zod");

// Validation Schema
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive value"),
  imageUrl: z.string().url("Invalid image URL"),
  adminId: z.string().min(1, "Admin ID is required"),
});

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    const adminId = req.adminId;
    console.log(title, description, price, imageUrl, adminId);
    // Validate data
    const parsedData = courseSchema.safeParse({
      title,
      description,
      price,
      imageUrl,
      adminId,
    });
    console.log(parsedData);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.format(),
      });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: adminId,
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  price: z.coerce.number().min(0, "Price must be a positive value").optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const adminId = req.adminId;

    const { title, description, price, imageUrl } = req.body;

    // Validate input
    const parsed = updateCourseSchema.safeParse({
      title,
      description,
      price,
      imageUrl,
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.format(),
      });
    }

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Ensure only the creator can update
    if (course.creatorId.toString() !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot update this course",
      });
    }

    // Update only provided fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = price;
    if (imageUrl) course.imageUrl = imageUrl;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAdminCourses = async (req, res) => {
  try {
    const adminId = req.adminId; // coming from auth middleware

    const courses = await Course.find({ creatorId: adminId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Admin courses fetched successfully",
      count: courses.length,
      courses,
    });

  } catch (error) {
    console.error("Get admin courses error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const adminId = req.adminId; // from auth middleware

    // Find course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    console.log(course);

    // Ensure only the creator can delete
    if (course.creatorId.toString() !== adminId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You cannot delete this course",
      });
    }

    // Delete course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      deletedCourse:course
    });

  } catch (error) {
    console.error("Delete course error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


