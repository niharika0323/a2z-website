import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'ALL';
    const search = searchParams.get('search') || '';

    const employees = await db.getEmployees({ status, search });
    const stats = await db.getAttendanceStats();

    return NextResponse.json({
      employees,
      stats,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch employees';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, username, password, role, department, email, phone, status } = body;

    if (!name || !username || !role || !email) {
      return NextResponse.json(
        { error: 'Name, username, role, and email are required.' },
        { status: 400 }
      );
    }

    // Check if user already exists with same Employee ID
    if (id && id.trim()) {
      const existingById = await db.getEmployeeById(id.trim());
      if (existingById) {
        return NextResponse.json(
          { error: 'User already exists with this employee ID.' },
          { status: 409 }
        );
      }
    }

    // Check if user already exists with same Email
    if (email && email.trim()) {
      const existingByEmail = await db.getEmployeeByEmail(email.trim());
      if (existingByEmail) {
        return NextResponse.json(
          { error: 'User already exists with this email address.' },
          { status: 409 }
        );
      }
    }

    // Check if user already exists with same Username
    const existing = await db.getEmployeeByUsername(username);
    if (existing) {
      return NextResponse.json(
        { error: `User already exists with username "${username}".` },
        { status: 409 }
      );
    }

    const newEmp = await db.createEmployee({
      id: id?.trim(),
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: password?.trim() || 'password123',
      role: role.trim(),
      department: department?.trim() || 'Operations',
      email: email.trim(),
      phone: phone?.trim() || '',
      status: status || '',
    });

    const stats = await db.getAttendanceStats();

    return NextResponse.json({ employee: newEmp, stats }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create employee';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    }

    const updated = await db.updateEmployee(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Employee not found.' }, { status: 404 });
    }

    const stats = await db.getAttendanceStats();
    return NextResponse.json({ employee: updated, stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update employee';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required.' }, { status: 400 });
    }

    if (id === 'ADM-001') {
      return NextResponse.json({ error: 'Primary Administrator cannot be deleted.' }, { status: 403 });
    }

    const success = await db.deleteEmployee(id);
    if (!success) {
      return NextResponse.json({ error: 'Employee could not be deleted or not found.' }, { status: 404 });
    }

    const stats = await db.getAttendanceStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete employee';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
