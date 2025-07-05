import nodemailer from "nodemailer";

export const mail = async (content) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 25,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  try {
    const verify = await transporter.verify();
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: content.to,
      subject: content.subject,
      text: content.subject,
      html: content.html,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const otpFormat = (username , otp) => {
  const otpFormatMail = `
    <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8" />
        <title>Your One-Time Password</title>
        <style>
            body {
            background-color: #f2f4f6;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            }
            .container {
            max-width: 500px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .title {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            }
            .otp-box {
            background-color: #f4f4f4;
            border: 1px dashed #ccc;
            border-radius: 6px;
            text-align: center;
            padding: 20px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 6px;
            color: #2f54eb;
            margin: 20px 0;
            }
            .footer {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 30px;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="title">Your OTP Code</div>
            <p>Hello, ${username}</p>
            <p>Use the following One-Time Password (OTP) to complete your verification. This code is valid for the next <strong>10 minutes</strong>.</p>

            <div class="otp-box">${otp}</div>

            <p>If you didn't request this, please ignore this email.</p>

            <div class="footer">
            &copy; 2025 HostMyShow. All rights reserved.
            </div>
        </div>
        </body>
        </html>
    
    `;
  return otpFormatMail;
};
