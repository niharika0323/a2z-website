import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const events = await db.getEvents();
    return NextResponse.json({ events });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch events';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, date, type, description } = body;

    if (!title || !date || !type) {
      return NextResponse.json(
        { error: 'Title, date, and type are required.' },
        { status: 400 }
      );
    }

    const event = await db.createEvent({
      title: title.trim(),
      date: date.trim(),
      type: type.trim(),
      description: description?.trim() || '',
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    const success = await db.deleteEvent(id);
    if (!success) {
      return NextResponse.json({ error: 'Event could not be deleted or not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
