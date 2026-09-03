import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'ALL';
    const employee_id = searchParams.get('employee_id') || undefined;

    const tasks = db.getTasks({ status, employee_id });
    const stats = db.getTaskStats();

    return NextResponse.json({ tasks, stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, assigned_to, employee_name, priority, time, status } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Task title is required.' },
        { status: 400 }
      );
    }

    const task = db.createTask({
      id: id?.trim(),
      title: title.trim(),
      assigned_to: assigned_to?.trim(),
      employee_name: employee_name?.trim(),
      priority,
      time: time?.trim(),
      status,
    });

    const stats = db.getTaskStats();
    return NextResponse.json({ task, stats }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required.' }, { status: 400 });
    }

    const updated = db.updateTask(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    const stats = db.getTaskStats();
    return NextResponse.json({ task: updated, stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required.' }, { status: 400 });
    }

    const success = db.deleteTask(id);
    if (!success) {
      return NextResponse.json({ error: 'Task not found or could not be deleted.' }, { status: 404 });
    }

    const stats = db.getTaskStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
