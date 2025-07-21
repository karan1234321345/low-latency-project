import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.TRANSPORTER_USER.toString(),
    pass: process.env.TRANSPORTER_USER_PASSWORD.toString(),
  },
});

export async function sendEmail(to, subject, otp) {
  const mailOptions = {
    from: process.env.TRANSPORTER_USER.toString(),
    to: to,
    subject: subject,
    text: `Your OTP is ${otp}  this otp will be expired in 5 min`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log('error in sending email');
    return false;
  }
}
