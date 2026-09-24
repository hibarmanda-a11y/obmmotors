import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    const query = {};
    if (status && status !== 'all') query.status = status;

    const appointments = await db
      .collection('appoinment')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      appointments: appointments.map((a) => ({ ...a, _id: a._id.toString() })),
    });
  } catch (error) {
    console.error('Admin appointments GET error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}