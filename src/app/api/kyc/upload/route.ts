import { NextRequest, NextResponse } from 'next/server';
import { cloudinaryAPI } from '@/lib/api/cloudinary';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const uploadSchema = z.object({
  file: z.string(), // Base64 encoded file
  documentType: z.enum(['ID_FRONT', 'ID_BACK', 'SELFIE', 'PROOF_OF_ADDRESS']),
  userId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = uploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { file, documentType, userId } = validation.data;

    // Upload to Cloudinary
    const uploadResult = await cloudinaryAPI.uploadDocument(file, userId, documentType);

    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, message: uploadResult.error || 'Upload failed' },
        { status: 500 }
      );
    }

    // Save to database
    const kycDocument = await prisma.kYCDocument.create({
      data: {
        userId,
        documentType: documentType as any,
        fileUrl: uploadResult.url!,
        status: 'PENDING',
      },
    });

    // Check if all required documents are uploaded
    const uploadedDocs = await prisma.kYCDocument.findMany({
      where: { userId },
    });

    const requiredTypes = ['ID_FRONT', 'ID_BACK', 'SELFIE', 'PROOF_OF_ADDRESS'];
    const allUploaded = requiredTypes.every((type) =>
      uploadedDocs.some((doc: any) => doc.documentType === type && doc.status !== 'REJECTED')
    );

    // Update user KYC status if all documents uploaded
    if (allUploaded) {
      await prisma.user.update({
        where: { id: userId },
        data: { kycStatus: 'PENDING' },
      });
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('KYC upload error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during upload' },
      { status: 500 }
    );
  }
}
