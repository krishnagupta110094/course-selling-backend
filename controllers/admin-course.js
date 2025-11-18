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
    const { title, description, price, imageUrl} = req.body;
    const adminId = req.adminId;
    console.log(title,description,price,imageUrl,adminId)
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
