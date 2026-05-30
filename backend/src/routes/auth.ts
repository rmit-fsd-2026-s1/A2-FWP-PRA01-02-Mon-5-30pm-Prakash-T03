import { Router, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Validation Helpers
const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) return "Email is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Please enter a valid email address.";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[!@#$%^&*]/.test(password))
    return "Password must include a special character (!@#$%^&*).";
  return null;
};

const validateName = (name: string): string | null => {
  if (!name || !name.trim()) return "Name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone || !phone.trim()) return "Phone number is required.";
  const re = /^(\+?61|0)[2-9]\d{8}$|^\d{10}$/;
  if (!re.test(phone.replace(/\s/g, "")))
    return "Please enter a valid Australian phone number.";
  return null;
};

const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET || "super_secret_venueflow_token_key_123!";
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );
};

// Sign Up Route
router.post("/signup", async (req, res) => {
  const { email, password, name, phone, role } = req.body;

  // Validate inputs
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  const nameErr = validateName(name);
  const phoneErr = validatePhone(phone);

  if (emailErr || passErr || nameErr || phoneErr) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: { email: emailErr, password: passErr, name: nameErr, phone: phoneErr }
    });
  }

  if (role !== "hirer" && role !== "vendor") {
    return res.status(400).json({ message: "Invalid role selected." });
  }

  try {
    // Check if email already exists
    const existingUser = await userRepository.findOneBy({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email address already exists." });
    }

    // Generate specific ID style
    const shortId = Math.random().toString(36).substring(2, 7);
    const userId = `${role}-${shortId}`;

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Save user
    const newUser = userRepository.create({
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      phone: phone.trim(),
      role,
    });

    await userRepository.save(newUser);

    const token = generateToken(newUser);

    return res.status(201).json({
      message: `Account created successfully. Welcome, ${newUser.name}!`,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt,
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error occurred during signup." });
  }
});

// Sign In Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find user
    const user = await userRepository.findOneBy({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "No account found with this email address." });
    }

    // Compare passwords
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      }
    });

  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Server error occurred during signin." });
  }
});

// Get User Profile Route
router.get("/profile", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    const user = await userRepository.findOneBy({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Server error retrieving user profile." });
  }
});

// Update Profile Route
router.put("/profile", authenticateToken as any, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const { name, phone, avatarUrl } = req.body;

  const nameErr = validateName(name);
  const phoneErr = validatePhone(phone);

  if (nameErr || phoneErr) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: { name: nameErr, phone: phoneErr }
    });
  }

  try {
    const user = await userRepository.findOneBy({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name.trim();
    user.phone = phone.trim();
    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl;
    }

    await userRepository.save(user);

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error updating profile." });
  }
});

export default router;
