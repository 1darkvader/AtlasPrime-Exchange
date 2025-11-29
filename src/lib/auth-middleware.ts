import { cookies } from 'next/headers';
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
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }

    // Check if user is admin or super admin
    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
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
    console.error('Error getting admin user:', error);
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
