const Admin = require("../models/admin-schema");
const bcrypt = require("bcrypt");
const z = require("zod");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Zod validation schema
const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // 1️⃣ Validate user input
    const parsedData = signupSchema.safeParse({
      email,
      password,
      firstName,
      lastName,
    });
    // console.log(parsedData);
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.errors,
      });
    }

    // 2️⃣ Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const admin = await Admin.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Zod validation schema
const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    const parsedData = signinSchema.safeParse({ email, password });
    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.errors,
      });
    }

    // 2️⃣ Find user by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "admin does not exist. Please sign up first.",
      });
    }

    // 3️⃣ Compare password
    const isPassCorrect = await bcrypt.compare(password, admin.password);
    if (!isPassCorrect) {
      return res.status(403).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 4️⃣ Generate JWT Token
    const payload = {
      id: admin._id,
      email: admin.email,
    };

    const token = jwt.sign(payload, process.env.JWT_ADMIN_PASSWORD, {
      expiresIn: "2d",
    });

    //--------------------------------------------------//
    //TODO: Write Cookie Logic Here//
    //--------------------------------------------------//

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
