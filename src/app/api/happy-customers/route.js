import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await connectDB();
    const collection = db.collection('happy-customer');

    const customers = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // ✅ Serialize _id
    const serialized = customers.map((c) => ({
      _id: c._id?.toString(),
      image: c.image,
      ownerName: c.ownerName,
      model: c.model,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ customers: serialized });
  } catch (error) {
    console.error('Error fetching happy customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch happy customers' },
      { status: 500 }
    );
  }
}