import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  try {
    await transporter.verify(); // Verify connection configuration

    await transporter.sendMail({
      from: `"Password Reset" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset OTP request from AJK-PSC",
      text: `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`,
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #ffffff;
      color: #000000;
    }
    .email-container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 20px auto;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #000000;
    }
    .header {
      padding: 20px 0;
      background-color: #000000;
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      padding: 20px;
      text-align: left;
      font-size: 16px;
      line-height: 1.5;
    }
    .otp-container {
      text-align: center;
      margin: 20px 0;
    }
    .otp {
      display: inline-block;
      font-size: 24px;
      font-weight: bold;
      color: #000000;
      background-color: #f1f1f1;
      padding: 10px 20px;
      border-radius: 5px;
    }
    .footer {
      padding: 20px;
      background-color: #f9f9f9;
      border-top: 1px solid #eeeeee;
      font-size: 14px;
      color: #777777;
      text-align: center;
    }
    .footer a {
      color: #000000;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <table class="email-container" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td class="header">
        Password Reset Request
      </td>
    </tr>
    <tr>
      <td class="content">
        <p>Hello,</p>
        <p>
          You have requested to reset your password. Please use the OTP below to proceed with the reset process:
        </p>
        <div class="otp-container">
          <span class="otp">
            ${otp}
          </span>
        </div>
        <p>
          This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
        </p>
        <p>Thank you,</p>
        <p><strong>The Support Team</strong></p>
      </td>
    </tr>
    <tr>
      <td class="footer">
        <p>If you need further assistance, contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });
  } catch (error: any) {
    console.error("Email service error:", error);
    console.log("Development OTP:", otp);
    throw new Error(
      "Failed to send email. Please check email service configuration."
    );
  }
};
