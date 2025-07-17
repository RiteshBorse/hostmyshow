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

export const eventMarketingFormat = (event) => {
  const year = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${event.title} - Event Announcement</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f8fa; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f8fa; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <!-- Header Banner -->
          <tr>
            <td>
              <img src="cid:event-banner" alt="${event.title}" style="width: 100%; max-height: 300px; object-fit: cover;">
            </td>
          </tr>

          <!-- Event Title Section -->
          <tr>
            <td style="background-color: #1a237e; color: #ffffff; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; margin-bottom: 10px;">${event.title}</h1>
              <p style="margin: 0; font-size: 16px; color: #e3f2fd;">🗓️ ${new Date(event.eventDateTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p style="margin: 5px 0; font-size: 16px; color: #e3f2fd;">⏰ </p>
              <p style="margin: 5px 0; font-size: 16px; color: #e3f2fd;">📍 ${event.location}</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px;">
              <!-- Description -->
              <div style="margin-bottom: 25px;">
                <h2 style="color: #1a237e; margin-bottom: 15px;">About The Event</h2>
                <p style="line-height: 1.6; color: #555;">${event.description}</p>
              </div>

              <!-- Highlights -->
              <div style="margin-bottom: 25px;">
                <h2 style="color: #1a237e; margin-bottom: 15px;">Event Highlights</h2>
                <table width="100%" style="border-collapse: separate; border-spacing: 0 10px;">
                  <tr>
                    <td width="50%" style="padding: 15px; background-color: #e8eaf6; border-radius: 6px;">
                      <p style="margin: 0; color: #1a237e;">🎫 Limited Seats Available</p>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">Book early to secure your spot</p>
                    </td>
                    <td width="50%" style="padding: 15px; background-color: #e8eaf6; border-radius: 6px;">
                      <p style="margin: 0; color: #1a237e;">💰 Ticket Price</p>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">Starting from ₹${event.cost}</p>
                    </td>
                  </tr>
                  ${event.certificate ? `
                  <tr>
                    <td width="50%" style="padding: 15px; background-color: #e8eaf6; border-radius: 6px;">
                      <p style="margin: 0; color: #1a237e;">📜 Certificate</p>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">Participation certificate included</p>
                    </td>
                  ` : ''}
                  ${event.personalized ? `
                    <td width="50%" style="padding: 15px; background-color: #e8eaf6; border-radius: 6px;">
                      <p style="margin: 0; color: #1a237e;">🌐 Personalized Website</p>
                      <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">Exclusive event portal</p>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL}" style="background-color: #1a237e; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Book Your Tickets Now
                </a>
              </div>

              <!-- Additional Info -->
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.5;">
                  ⚡ Early bird discounts available<br>
                  📞 For inquiries, contact our support team<br>
                  ⏰ Limited time offer
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a237e; color: #ffffff; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">Follow us for more exciting events!</p>
              <div style="margin: 15px 0;">
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px;">Twitter</a>
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px;">Instagram</a>
              </div>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #e3f2fd;">
                &copy; ${year} HostMyShow. All rights reserved.
              </p>
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
