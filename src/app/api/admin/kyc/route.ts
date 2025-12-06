import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email/mailgun';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required. Please login as admin.' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'PENDING';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get KYC documents
    const documents = await prisma.kYCDocument.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            kycStatus: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return NextResponse.json(documents);
  } catch (error: any) {
    console.error('Error fetching KYC documents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch KYC documents' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required. Please login as admin.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { documentId, action, rejectionReason } = body;

    if (!documentId || !action) {
      return NextResponse.json(
        { error: 'Document ID and action are required' },
        { status: 400 }
      );
    }

    if (action === 'REJECTED' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    // Update document status
    const document = await prisma.kYCDocument.update({
      where: { id: documentId },
      data: {
        status: action,
        rejectionReason: action === 'REJECTED' ? rejectionReason : null,
        reviewedAt: new Date()
      },
      include: {
        user: true
      }
    });

    // Check if all user's documents are approved
    if (action === 'APPROVED') {
      const userDocuments = await prisma.kYCDocument.findMany({
        where: { userId: document.userId }
      });

      const allApproved = userDocuments.every((doc: any) => doc.status === 'APPROVED');

      if (allApproved) {
        // Update user KYC status to VERIFIED
        await prisma.user.update({
          where: { id: document.userId },
          data: { kycStatus: 'VERIFIED' }
        });

        // Send approval email
        try {
          await emailService.sendKYCApprovalEmail(
            document.user.email,
            document.user.username
          );
        } catch (error) {
          console.error('Failed to send KYC approval email:', error);
        }
      }
    }

    // If rejected, update user KYC status and send email
    if (action === 'REJECTED') {
      await prisma.user.update({
        where: { id: document.userId },
        data: { kycStatus: 'REJECTED' }
      });

      // Send rejection email
      try {
        await emailService.sendKYCRejectionEmail(
          document.user.email,
          document.user.username,
          rejectionReason || 'Your documents did not meet our verification requirements.'
        );
      } catch (error) {
        console.error('Failed to send KYC rejection email:', error);
      }
    }

    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    console.error('Error updating KYC document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update KYC document' },
      { status: 500 }
    );
  }
}
