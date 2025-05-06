import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async ({ name, password }) => {
  const existingUser = await User.findOne({ name });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, password: hashedPassword });
  await newUser.save();

  return { message: "User registered successfully" };
};

const loginUser = async ({ name, password }) => {
  const user = await User.findOne({ name });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return { message: "Login successful", token };
};

export { registerUser, loginUser };
