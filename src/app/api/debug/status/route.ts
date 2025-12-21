import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // Count users by role
    const [totalUsers, adminUsers, superAdmins, regularUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'SUPER_ADMIN' } }),
      prisma.user.count({ where: { role: 'USER' } }),
    ]);

    // Get current session info
    let currentUser = null;
    let sessionInfo = null;

    if (token) {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true }
      });

      if (session) {
        currentUser = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.username,
          role: session.user.role,
        };
        sessionInfo = {
          expiresAt: session.expiresAt,
          isExpired: new Date(session.expiresAt) < new Date(),
        };
      }
    }

    // Get admin users for reference
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPER_ADMIN' }
        ]
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
      take: 5
    });

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        kycStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        totalUsers,
        usersByRole: {
          superAdmins,
          admins: adminUsers,
          users: regularUsers,
        }
      },
      currentSession: {
        hasToken: !!token,
        user: currentUser,
        session: sessionInfo,
        isAdmin: currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN',
      },
      adminAccounts: admins,
      recentUsers,
      help: {
        message: 'If currentSession.user is null, you need to login',
        loginUrl: '/login',
        adminCredentials: 'Check your .env or CREDENTIALS.md file',
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
