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
    console.log('🔄 Running: npx prisma db push --accept-data-loss');
    console.log('📂 Current directory:', process.cwd());
    console.log('🔑 DATABASE_URL exists:', !!process.env.DATABASE_URL);

    // Run prisma db push (use npx instead of bunx for Render compatibility)
    const startTime = Date.now();
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss', {
      env: { ...process.env, FORCE_COLOR: '0' },
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      timeout: 60000, // 60 second timeout
    });

    const duration = Date.now() - startTime;

    console.log('✅ Migration completed in', duration, 'ms');
    console.log('📝 stdout:', stdout);
    console.log('⚠️ stderr:', stderr || 'none');

    // Also generate Prisma client
    console.log('🔄 Running: npx prisma generate');
    const { stdout: genStdout, stderr: genStderr } = await execAsync('npx prisma generate');
    console.log('✅ Generate completed');
    console.log('📝 generate stdout:', genStdout);

    return NextResponse.json({
      success: true,
      message: 'Database schema updated successfully! New columns: userConfirmed, adminApproved, approvedBy, rejectionReason, proofUrl, approvedAt',
      output: stdout,
      generateOutput: genStdout,
      warning: stderr || null,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Database migration error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stdout:', error.stdout);
    console.error('❌ Error stderr:', error.stderr);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update database schema',
        details: error.message,
        output: error.stdout || '',
        errorOutput: error.stderr || '',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
