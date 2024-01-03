import express from "express";
import bcrypt from "bcrypt"
import { getuser, getuserbyForgettoken } from "../controllers/login/login.js";
import { GenearateToken } from "../auth/auth.js";
import { ForgotpasswordLink } from "../Helpers/forgotpassword.js";

const router = express.Router();

// Send reset password link
router.post("/", async (req, res) => {
  try {
    const user = await getuser(req);
    const email = req.body.email;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = GenearateToken(user._id);
    const encodedToken = encodeURIComponent(token);

    user.token = token;
    await user.save();

    const resetPasswordLink = `${process.env.backend}forgotpassword/${encodedToken}`;

    const reset = await ForgotpasswordLink(email, resetPasswordLink);

    if (reset && reset.messageId) {
      res
        .status(200)
        .json({ data: "Reset password link sent successfully", reset });
    } else {
      res.status(500).json({ error: "Failed to send reset password link" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// Handle reset password
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const data = await getuserbyForgettoken(userId)
    if (req.body.password.length < 6) {
      return res
        .status(409)
        .json({ error: "Password length should be minimum 6" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    data.password=hashedpassword;
    data.token=" ";
    await data.save();

    res.status(200).json({ data: "Password reset successfully" ,hashedpassword});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

export const ForgotPasswordRouter = router;
