// Cloudinary API Service for KYC Document Uploads

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export const cloudinaryAPI = {
  /**
   * Upload KYC document to Cloudinary
   */
  async uploadDocument(
    file: File | Buffer | string,
    userId: string,
    documentType: string
  ): Promise<UploadResult> {
    try {
      const folder = `atlasprime/kyc/${userId}`;
      const publicId = `${documentType}_${Date.now()}`;

      let uploadResult;

      if (typeof file === 'string') {
        // Base64 string
        uploadResult = await cloudinary.uploader.upload(file, {
          folder,
          public_id: publicId,
          resource_type: 'auto',
        });
      } else if (Buffer.isBuffer(file)) {
        // Buffer
        uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder, public_id: publicId, resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(file);
        });
      } else {
        // File object - convert to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder, public_id: publicId, resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
      }

      return {
        success: true,
        url: (uploadResult as any).secure_url,
        publicId: (uploadResult as any).public_id,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  /**
   * Delete KYC document from Cloudinary
   */
  async deleteDocument(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  },

  /**
   * Get upload signature for client-side uploads
   */
  getUploadSignature(params: Record<string, any>): { signature: string; timestamp: number } {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { ...params, timestamp },
      process.env.CLOUDINARY_API_SECRET || ''
    );

    return { signature, timestamp };
  },
};
