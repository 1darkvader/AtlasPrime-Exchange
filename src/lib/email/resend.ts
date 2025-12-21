import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'demo-key');

export const emailService = {
  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'AtlasPrime <noreply@atlasprime.com>',
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
                  <p>© 2024 AtlasPrime Exchange. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Email send error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  },

  /**
   * Send email verification
   */
  async sendVerificationEmail(email: string, verificationToken: string): Promise<boolean> {
    try {
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'AtlasPrime <noreply@atlasprime.com>',
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
                  <p>© 2024 AtlasPrime Exchange. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Email send error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  },

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'AtlasPrime <noreply@atlasprime.com>',
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
                  <p>© 2024 AtlasPrime Exchange. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Email send error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  },
};
