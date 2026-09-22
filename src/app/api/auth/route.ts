import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const employee = await db.getEmployeeByUsername(username.trim());

    if (!employee || employee.password !== password) {
      return NextResponse.json(
        { error: 'Invalid username or password. Please try again.' },
        { status: 401 }
      );
    }

    // Return safe user object (omit password)
    return NextResponse.json({
      user: {
        id: employee.id,
        name: employee.name,
        username: employee.username,
        role: employee.role,
        email: employee.email,
        phone: employee.phone,
        status: employee.status,
        check_in_time: employee.check_in_time,
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
