import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../db/user.js";


export const createUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      email,
      password: hashedPassword,
      username,
    }).save();

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};