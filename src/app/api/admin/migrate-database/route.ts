import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth-middleware';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  // Verify admin access
  console.log('🔐 Migration: Checking admin access...');

  const admin = await getAdminUser();

  console.log('🔐 Migration: Admin user result:', {
    found: !!admin,
    email: admin?.email,
    role: admin?.role
  });

  if (!admin) {
    console.error('❌ Migration failed: No admin user found in session');
    return NextResponse.json(
      {
        error: 'Unauthorized: Admin access required. Please login as admin.',
        details: {
          message: 'You must be logged in as an admin to run migrations',
          loginUrl: '/login',
          debugUrl: '/api/debug/status'
        }
      },
      { status: 401 }
    );
  }

  if (admin.role !== 'SUPER_ADMIN') {
    console.error('❌ Migration failed: Insufficient permissions', {
      currentRole: admin.role,
      requiredRole: 'SUPER_ADMIN'
    });
    return NextResponse.json(
      {
        error: 'Only Super Admins can run database migrations',
        currentRole: admin.role,
        message: 'Your role is ' + admin.role + ', but SUPER_ADMIN is required.'
      },
      { status: 403 }
    );
  }

  console.log('✅ Migration: Admin authorized', { email: admin.email });

  // Run database migration
  try {
    // Run prisma db push (use npx instead of bunx for Render compatibility)
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');

    // Also generate Prisma client
    const { stdout: genStdout } = await execAsync('npx prisma generate');

    return NextResponse.json({
      success: true,
      message: 'Database schema updated successfully',
      output: stdout,
      generateOutput: genStdout,
      warning: stderr || null,
    });
  } catch (error: any) {
    console.error('Database migration error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update database schema',
        details: error.message,
        output: error.stdout || '',
        errorOutput: error.stderr || '',
      },
      { status: 500 }
    );
  }
}
