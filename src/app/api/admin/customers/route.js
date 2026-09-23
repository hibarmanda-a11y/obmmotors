import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 50, 100);
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    const collection = db.collection('happy-customer');
    const [customers, total] = await Promise.all([
      collection.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments({}),
    ]);

    return NextResponse.json({
      customers: customers.map((c) => ({ ...c, _id: c._id.toString() })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin customers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await connectDB();
    const data = await request.json();

    if (!data.image || !data.ownerName || !data.model) {
      return NextResponse.json(
        { error: 'Image, owner name, and model are required' },
        { status: 400 }
      );
    }

    data.createdAt = new Date();

    const result = await db.collection('happy-customer').insertOne(data);

    return NextResponse.json(
      { customer: { _id: result.insertedId.toString(), ...data } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin customers POST error:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}