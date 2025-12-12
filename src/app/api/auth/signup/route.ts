import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { emailService } from '@/lib/email/mailgun';
import crypto from 'crypto';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
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

    const { email, firstName, lastName, password, country, phoneNumber } = validation.data;

    // Generate username from firstName and lastName
    const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    let username = baseUsername;

    // Check if username exists and add random number if needed
    let usernameExists = await prisma.user.findUnique({ where: { username } });
    let attempts = 0;
    while (usernameExists && attempts < 10) {
      username = `${baseUsername}${Math.floor(Math.random() * 9999)}`;
      usernameExists = await prisma.user.findUnique({ where: { username } });
      attempts++;
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      const errors: Record<string, string> = {};
      errors.email = 'Email already registered';

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
        firstName,
        lastName,
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
    console.log('📧 Sending welcome email to:', user.email);
    const displayName = user.firstName || user.username;
    emailService.sendWelcomeEmail(user.email, displayName)
      .then((success) => {
        if (success) {
          console.log('✅ Welcome email sent successfully to:', user.email);
        } else {
          console.log('⚠️ Welcome email failed to send to:', user.email);
        }
      })
      .catch((error) => {
        console.error('❌ Failed to send welcome email:', error);
      });

    // Send verification email (async, don't wait for it)
    console.log('📧 Sending verification email to:', user.email);
    emailService.sendVerificationEmail(user.email, verificationToken)
      .then((success) => {
        if (success) {
          console.log('✅ Verification email sent successfully to:', user.email);
        } else {
          console.log('⚠️ Verification email failed to send to:', user.email);
        }
      })
      .catch((error) => {
        console.error('❌ Failed to send verification email:', error);
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
