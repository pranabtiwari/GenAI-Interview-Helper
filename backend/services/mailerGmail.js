import nodemailer from "nodemailer";
import "dotenv/config"


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendResetPasswordMail(to, resetLink) {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL and EMAIL_PASS must be set");
  }

  return transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Password Reset Request",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background-color: #f5f5f5;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 16px;
              margin-bottom: 20px;
              color: #555;
            }
            .message {
              font-size: 15px;
              line-height: 1.6;
              color: #666;
              margin-bottom: 30px;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
            .reset-button {
              display: inline-block;
              padding: 12px 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: 600;
              font-size: 16px;
              transition: transform 0.2s;
            }
            .reset-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            .link-text {
              font-size: 12px;
              color: #999;
              word-break: break-all;
              margin-top: 15px;
              padding: 10px;
              background-color: #f9f9f9;
              border-radius: 4px;
              font-family: monospace;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              font-size: 14px;
              color: #856404;
            }
            .footer {
              background-color: #f9f9f9;
              padding: 20px 30px;
              text-align: center;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #eee;
            }
            .footer p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>GenAI Interview Helper</p>
            </div>
            
            <div class="content">
              <p class="greeting">Hello,</p>
              
              <p class="message">
                We received a request to reset the password associated with your account. 
                Click the button below to create a new password.
              </p>
              
              <div class="button-container">
                <a href="${resetLink}" class="reset-button">Reset Password</a>
              </div>
              
              <p class="message">
                Or copy and paste this link in your browser:
              </p>
              <p class="link-text">${resetLink}</p>
              
              <div class="warning">
                ⚠️ <strong>This link expires in 10 minutes.</strong> If you didn't request a password reset, 
                please ignore this email or contact support immediately.
              </div>
              
              <p class="message" style="margin-top: 30px;">
                Best regards,<br>
                <strong>GenAI Interview Helper Team</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; 2026 GenAI Interview Helper. All rights reserved.</p>
              <p>If you have any questions, please contact us at support@genai.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}

export default sendResetPasswordMail;