import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { emailService } from '@/lib/email/mailgun';
import crypto from 'crypto';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  country: z.string().min(2, 'Please select your country'),
  phoneNumber: z.string().min(5, 'Please enter a valid phone number'),
  acceptTerms: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.acceptTerms === true, {
  message: "You must accept the terms and conditions",
  path: ["terms"],
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });

      return NextResponse.json(
        { success: false, message: 'Validation failed', errors },
        { status: 400 }
      );
    }

    const { email, username, password, country, phoneNumber } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username },
        ],
      },
    });

    if (existingUser) {
      const errors: Record<string, string> = {};
      if (existingUser.email === email.toLowerCase()) {
        errors.email = 'Email already registered';
      }
      if (existingUser.username === username) {
        errors.username = 'Username already taken';
      }

      return NextResponse.json(
        { success: false, message: 'User already exists', errors },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username,
        passwordHash,
        countryCode: country,
        phoneNumber,
        emailVerified: false,
        kycStatus: 'NOT_STARTED',
        twoFactorEnabled: false,
      },
    });

    // Create initial wallets for common assets
    const assets = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'];
    await Promise.all(
      assets.map((asset) =>
        prisma.wallet.create({
          data: {
            userId: user.id,
            asset,
            balance: 0,
            lockedBalance: 0,
          },
        })
      )
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Create session in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hour expiry

    // Save verification token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationTokenExpiry: verificationTokenExpiry,
      },
    });

    // Send welcome email (async, don't wait for it)
    emailService.sendWelcomeEmail(user.email, user.username).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    // Send verification email (async, don't wait for it)
    emailService.sendVerificationEmail(user.email, verificationToken).catch((error) => {
      console.error('Failed to send verification email:', error);
    });

    // Return user data without password
    const { passwordHash: _, twoFactorSecret: __, ...userWithoutSensitiveData } = user;

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutSensitiveData,
        kycStatus: user.kycStatus.toLowerCase().replace('_', '') as any,
      },
      token,
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
