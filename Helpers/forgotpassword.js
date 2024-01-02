import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function ForgotpasswordLink(email,token) {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.emailapppassword
        }
    });

    //Forgot password link
    const resetPasswordLink = token; 

    
let htmlContent = {
    from: process.env.email,
    to: email,
    subject: 'Reset Your Password',
    html: `<h5>Hi there,</h5>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <p>The link will be expired in 30 minutes</p>
      <div style="text-align: center;">
        <a href="${resetPasswordLink}" target="_blank" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 15px;">
          Reset Password
        </a>
      </div>`,
  };
    

    try {
        let res = await transport.sendMail(htmlContent);
        console.log(`Message sent: ${res.messageId}`);
        return res;
    } catch (err) {
        console.error({ error: err });
    }
}
