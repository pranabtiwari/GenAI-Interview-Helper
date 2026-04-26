import userModel from "../model/user.model.js";
import { registerSchema, loginSchema } from "../schema/user.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function registerAuthController(req, res) {
  try {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const { name, email, password } = validationResult.data;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter the User Credentials",
      });
    }

    const ifUserIsAvailable = await userModel.findOne({
      email,
    });

    if (ifUserIsAvailable) {
      return res.status(400).json({
        message: "User alredy available",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
    );
    const useResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    res.status(201).json({
      message: "User had been created",
      token,
      user: useResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Problem",
      error: error.message,
    });
  }
}

async function userLoginController(req, res) {
  try {
    // ✅ Validate input
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    // ✅ Use validated data only
    const { email, password } = validationResult.data;

    // ❌ No need for manual checks

    // ✅ Check user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password", // unified message
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // ✅ Check JWT secret
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY not defined");
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1d" },
    );

    // ✅ Clean response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function userLogOutController(req, res) {
  try {
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

export default {
  registerAuthController,
  userLoginController,
  userLogOutController,
};
