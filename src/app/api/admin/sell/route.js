import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    const query = {};
    if (status && status !== 'all') query.status = status;

    const deals = await db
      .collection('sell-deals')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      deals: deals.map((d) => ({ ...d, _id: d._id.toString() })),
    });
  } catch (error) {
    console.error('Admin sell GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}