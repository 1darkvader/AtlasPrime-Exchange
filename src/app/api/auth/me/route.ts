import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Try to get token from cookie first
    let token = cookieStore.get('auth_token')?.value;

    // If no cookie, try Authorization header (for admin panel)
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    console.log('🔍 Auth Check:', {
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 10)}...` : 'none'
    });

    if (!token) {
      return NextResponse.json({
        success: false,
        user: null,
        error: 'No auth token found - please login',
        debug: {
          cookies: cookieStore.getAll().map(c => c.name)
        }
      });
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            kycStatus: true,
            emailVerified: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    console.log('🔍 Session Check:', {
      sessionFound: !!session,
      userFound: !!session?.user,
      userRole: session?.user?.role,
      expiresAt: session?.expiresAt,
      isExpired: session ? new Date(session.expiresAt) < new Date() : null
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        user: null,
        error: 'Session not found - please login again',
        debug: {
          tokenExists: true,
          sessionInDb: false
        }
      });
    }

    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({
        success: false,
        user: null,
        error: 'Session expired - please login again',
        debug: {
          expiresAt: session.expiresAt,
          now: new Date()
        }
      });
    }

    console.log('✅ User authenticated:', {
      email: session.user.email,
      role: session.user.role
    });

    return NextResponse.json({
      success: true,
      user: session.user,
      token: token,
      isAdmin: session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN',
      debug: {
        role: session.user.role,
        kycStatus: session.user.kycStatus,
        sessionValid: true,
        authMethod: cookieStore.get('auth_token')?.value ? 'cookie' : 'header'
      }
    });
  } catch (error: any) {
    console.error('❌ Auth check error:', error);
    return NextResponse.json({
      success: false,
      user: null,
      error: error.message,
      debug: {
        errorType: error.constructor.name,
        errorMessage: error.message
      }
    }, { status: 500 });
  }
}
