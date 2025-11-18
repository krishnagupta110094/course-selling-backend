const User = require("../models/user-schema");
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist. Please sign up first.",
      });
    }

    // 3️⃣ Compare password
    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(403).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 4️⃣ Generate JWT Token
    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_USER_PASSWORD, {
      expiresIn: "2d",
    });

    //--------------------------------------------------//
            //TODO: Write Cookie Logic Here//
    //--------------------------------------------------//

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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
