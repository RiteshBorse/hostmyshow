import nodemailer from "nodemailer";

export const mail = async (content) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service : "gmail" ,
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
      attachments: content.attachments || [],
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

export const confirmationFormat = (title, booking_time, seats, userid, ticket_qr, payment_id, paymentAmt) => {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ticket Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f8fa; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f8fa; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #0d47a1; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">🎟️ Ticket Confirmation</h1>
              <p style="margin: 0; font-size: 14px;">Thank you for booking with us!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <h2 style="color: #0d47a1; margin-bottom: 10px;">Event Details</h2>
              <p><strong>Event:</strong> ${title}</p>
              <p><strong>Date & Time:</strong> ${new Date(booking_time).toLocaleString()}</p>
              <p><strong>Seats:</strong> ${seats}</p>
              <p><strong>Booked By (User ID):</strong> ${userid}</p>

              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">

              <h2 style="color: #0d47a1; margin-bottom: 10px;">Payment Details</h2>
              <p><strong>Payment ID:</strong> ${payment_id}</p>
              <p><strong>Amount Paid:</strong> ₹${paymentAmt}</p>

              <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">

              <h2 style="color: #0d47a1; margin-bottom: 10px;">Your Ticket QR Code</h2>
              <p style="margin-bottom: 10px;">Present this QR at the entrance for a smooth check-in.</p>
              <div style="text-align: center;">
                 {{TICKET_QR}}
              </div>

              <p style="margin-top: 30px; font-size: 14px; color: #555;">
                This ticket is non-refundable and non-transferable.<br />
                Please arrive 15 minutes before the scheduled time.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f0f0f0; color: #555; text-align: center; padding: 15px; font-size: 12px;">
              &copy; ${year} EventCorp. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
