import Mailgun from 'mailgun.js';
import formData from 'form-data';

const DOMAIN = process.env.MAILGUN_DOMAIN || 'mg.yourdomain.com';
const FROM = process.env.MAILGUN_FROM || 'AtlasPrime <noreply@mg.yourdomain.com>';

// Lazy initialization to avoid build-time errors
function getMailgunClient() {
  const apiKey = process.env.MAILGUN_API_KEY;

  if (!apiKey) {
    console.warn('MAILGUN_API_KEY is not configured. Email sending will be skipped.');
    return null;
  }

  const mailgun = new Mailgun(formData);
  return mailgun.client({
    username: 'api',
    key: apiKey,
  });
}

export const emailService = {
  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const mg = getMailgunClient();

    if (!mg) {
      console.log('Email would be sent to:', email, 'with reset token:', resetToken);
      return true; // Return true in development/when Mailgun is not configured
    }

    try {
      const resetUrl = `https://atlasprime.trade/reset-password?token=${resetToken}`;

      const messageData = {
        from: FROM,
        to: email,
        subject: 'Reset Your Password - AtlasPrime Exchange',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 30px;
                  background: #10b981;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #6b7280;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>AtlasPrime Exchange</h1>
                  <p>Password Reset Request</p>
                </div>
                <div class="content">
                  <h2>Reset Your Password</h2>
                  <p>We received a request to reset your password. Click the button below to create a new password:</p>
                  <a href="${resetUrl}" class="button">Reset Password</a>
                  <p>This link will expire in 1 hour.</p>
                  <p>If you didn't request this password reset, you can safely ignore this email.</p>
                  <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                    Or copy and paste this link in your browser:<br>
                    ${resetUrl}
                  </p>
                </div>
                <div class="footer">
                  <p>© 2025 AtlasPrime Exchange. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      await mg.messages.create(DOMAIN, messageData);
      return true;
    } catch (error) {
      console.error('Mailgun send error:', error);
      return false;
    }
  },

  /**
   * Send email verification
   */
  async sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
    const mg = getMailgunClient();

    if (!mg) {
      console.log('Email would be sent to:', email, 'with verification token:', verificationToken);
      return true; // Return true in development/when Mailgun is not configured
    }

    try {
      const verifyUrl = `https://atlasprime.trade/verify-email?token=${verificationToken}`;

      const messageData = {
        from: FROM,
        to: email,
        subject: 'Verify Your Email - AtlasPrime Exchange',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 30px;
                  background: #3b82f6;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #6b7280;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>AtlasPrime Exchange</h1>
                  <p>Welcome to AtlasPrime!</p>
                </div>
                <div class="content">
                  <h2>Verify Your Email Address</h2>
                  <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
                  <a href="${verifyUrl}" class="button">Verify Email</a>
                  <p>This link will expire in 24 hours.</p>
                  <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                    Or copy and paste this link in your browser:<br>
                    ${verifyUrl}
                  </p>
                </div>
                <div class="footer">
                  <p>© 2025 AtlasPrime Exchange. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      await mg.messages.create(DOMAIN, messageData);
      return true;
    } catch (error) {
      console.error('Mailgun send error:', error);
      return false;
    }
  },

  /**
   * Send KYC approval email
   */
  async sendKYCApprovalEmail(email: string, username: string): Promise<boolean> {
    const mg = getMailgunClient();

    if (!mg) {
      console.log('KYC approval email would be sent to:', email);
      return true;
    }

    try {
      const messageData = {
        from: FROM,
        to: email,
        subject: 'KYC Verification Approved - AtlasPrime Exchange',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 30px;
                  background: #10b981;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  margin: 20px 0;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #6b7280;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✅ KYC Verification Approved!</h1>
                </div>
                <div class="content">
                  <h2>Congratulations ${username}!</h2>
                  <p>Your KYC verification has been successfully approved. You now have full access to all AtlasPrime Exchange features.</p>
                  <p>You can now:</p>
                  <ul>
                    <li>✅ Deposit and withdraw funds without limits</li>
                    <li>✅ Trade all available assets</li>
                    <li>✅ Access advanced trading features</li>
                    <li>✅ Participate in staking and earn programs</li>
                  </ul>
                  <a href="https://atlasprime.trade/portfolio" class="button">Go to Dashboard</a>
                </div>
                <div class="footer">
                  <p>© 2025 AtlasPrime Exchange. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      await mg.messages.create(DOMAIN, messageData);
      return true;
    } catch (error) {
      console.error('Mailgun send error:', error);
      return false;
    }
  },

  /**
   * Send KYC rejection email
   */
  async sendKYCRejectionEmail(email: string, username: string, reason: string): Promise<boolean> {
    const mg = getMailgunClient();

    if (!mg) {
      console.log('KYC rejection email would be sent to:', email);
      return true;
    }

    try {
      const messageData = {
        from: FROM,
        to: email,
        subject: 'KYC Verification - Additional Information Required',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 30px;
                  background: #ef4444;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  margin: 20px 0;
                }
                .reason-box {
                  background: #fee2e2;
                  border-left: 4px solid #ef4444;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #6b7280;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>KYC Verification - Action Required</h1>
                </div>
                <div class="content">
                  <h2>Hi ${username},</h2>
                  <p>We've reviewed your KYC documents and need additional information to complete your verification.</p>
                  <div class="reason-box">
                    <strong>Reason:</strong><br>
                    ${reason}
                  </div>
                  <p>Please re-submit your documents with the correct information to proceed.</p>
                  <a href="https://atlasprime.trade/kyc" class="button">Re-submit Documents</a>
                  <p>If you have any questions, please contact our support team.</p>
                </div>
                <div class="footer">
                  <p>© 2025 AtlasPrime Exchange. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      await mg.messages.create(DOMAIN, messageData);
      return true;
    } catch (error) {
      console.error('Mailgun send error:', error);
      return false;
    }
  },

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    const mg = getMailgunClient();

    if (!mg) {
      console.log('Welcome email would be sent to:', email, 'for username:', username);
      return true; // Return true in development/when Mailgun is not configured
    }

    try {
      const messageData = {
        from: FROM,
        to: email,
        subject: 'Welcome to AtlasPrime Exchange!',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px;
                  border-radius: 0 0 10px 10px;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #6b7280;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome to AtlasPrime!</h1>
                </div>
                <div class="content">
                  <h2>Hi ${username}!</h2>
                  <p>Welcome to AtlasPrime Exchange - the world's leading cryptocurrency trading platform.</p>
                  <p>Get started with:</p>
                  <ul>
                    <li>Spot & Futures Trading</li>
                    <li>Staking & Earn</li>
                    <li>Advanced Trading Tools</li>
                    <li>24/7 Customer Support</li>
                  </ul>
                  <p>If you have any questions, feel free to reach out to our support team.</p>
                </div>
                <div class="footer">
                  <p>© 2025 AtlasPrime Exchange. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      };

      await mg.messages.create(DOMAIN, messageData);
      return true;
    } catch (error) {
      console.error('Mailgun send error:', error);
      return false;
    }
  },
};
