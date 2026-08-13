import User from "../models/user.model";
import EmailSender from "../services/mail.service";

const generateOTP = () => {
  const min = 1000;
  const max = 9999;
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const generateRandomToken = async () => {
  return generateOTP();
};

export const generateAndSaveOTP = async (email: string) => {
  const otp = generateOTP();
  const otpCreationTime = new Date();

  await User.updateOne(
    { email },
    { $set: { verificationOTP: otp, otpCreationTime } }
  );

  // Send OTP to user's email (implementation depends on your email service)
   // sending email verification otp
   const emailSender = new EmailSender(
    process.env.SENDER_EMAIL,
    process.env.SENDER_PASSWORD
  );
  await emailSender.send(
    email,
    "Your OTP Code",
    `Your OTP code is: ${otp}`
  );

  return true;
};