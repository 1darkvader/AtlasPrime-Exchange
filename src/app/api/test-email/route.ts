import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth-middleware';
import { emailService } from '@/lib/email/mailgun';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, type } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    console.log(`📧 Testing email delivery to: ${email} (Type: ${type || 'welcome'})`);

    let success = false;
    let message = '';

    try {
      if (type === 'welcome') {
        success = await emailService.sendWelcomeEmail(email, 'Test User');
        message = 'Welcome email sent successfully!';
      } else if (type === 'kyc-approval') {
        success = await emailService.sendKYCApprovalEmail(email, 'Test User');
        message = 'KYC approval email sent successfully!';
      } else if (type === 'kyc-rejection') {
        success = await emailService.sendKYCRejectionEmail(email, 'Test User', 'This is a test rejection email.');
        message = 'KYC rejection email sent successfully!';
      } else {
        // Default to welcome email
        success = await emailService.sendWelcomeEmail(email, 'Test User');
        message = 'Welcome email sent successfully!';
      }

      if (success) {
        console.log(`✅ Email sent successfully to: ${email}`);
        return NextResponse.json({
          success: true,
          message,
          email,
          type: type || 'welcome'
        });
      } else {
        console.log(`⚠️ Email failed to send to: ${email}`);
        return NextResponse.json({
          success: false,
          message: 'Email service returned false. Check Mailgun configuration.',
          email
        }, { status: 500 });
      }
    } catch (emailError: any) {
      console.error('❌ Email sending error:', emailError);
      return NextResponse.json({
        success: false,
        message: 'Failed to send email',
        error: emailError.message,
        email
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send test email' },
      { status: 500 }
    );
  }
}
