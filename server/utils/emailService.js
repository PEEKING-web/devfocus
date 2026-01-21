const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  try {
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL, // Must be verified in SendGrid
      subject: '🔐 Your DevFocus Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; }
            .otp-box { background: #f8f9fa; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 DevFocus</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">AI-Powered Pomodoro Timer</p>
            </div>
            <div class="content">
              <h2 style="color: #333;">Hi ${name}! 👋</h2>
              <p style="color: #666; line-height: 1.6;">Welcome to DevFocus! To complete your registration, please verify your email address using the code below:</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; color: #999; font-size: 12px;">Valid for 10 minutes</p>
              </div>

              <p style="color: #666; line-height: 1.6;">Enter this code in the verification screen to activate your account and start boosting your productivity!</p>
              
              <p style="color: #999; font-size: 13px; margin-top: 30px;">
                <strong>Didn't request this?</strong><br>
                If you didn't create a DevFocus account, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© 2025 DevFocus - Focus Better. Code Faster. Ship More.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    console.log(`✅ OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ SendGrid Error:', error.response?.body || error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
};