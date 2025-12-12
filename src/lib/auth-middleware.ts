import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  let token = cookieStore.get('auth_token')?.value;

  // If no cookie, try Authorization header (for admin panel)
  if (!token) {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    console.log('❌ getAdminUser: No token found in cookies or headers');
    return null;
  }

  try {
    console.log('🔍 getAdminUser: Looking up session for token:', token.substring(0, 10) + '...');

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) {
      console.log('❌ getAdminUser: No session found in database');
      return null;
    }

    if (new Date(session.expiresAt) < new Date()) {
      console.log('❌ getAdminUser: Session expired');
      return null;
    }

    // Check if user is admin or super admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      console.log('❌ getAdminUser: User is not admin. Role:', session.user.role);
      return null;
    }

    console.log('✅ getAdminUser: Admin authenticated:', session.user.email, session.user.role);

    return {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
      role: session.user.role,
      firstName: session.user.firstName,
      lastName: session.user.lastName
    };
  } catch (error) {
    console.error('❌ getAdminUser error:', error);
    return null;
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();

  if (!user) {
    throw new Error('Unauthorized: Admin access required');
  }

  return user;
}

export async function getUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  let token = cookieStore.get('auth_token')?.value;

  // If no cookie, try Authorization header
  if (!token) {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session) {
      return null;
    }

    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
      role: session.user.role,
      firstName: session.user.firstName,
      lastName: session.user.lastName
    };
  } catch (error) {
    console.error('getUser error:', error);
    return null;
  }
}
