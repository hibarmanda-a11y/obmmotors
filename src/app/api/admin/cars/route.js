import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { generateSlug } from '@/lib/r2';

// GET: List all cars
export async function GET(request) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = Math.min(parseInt(searchParams.get('limit')) || 50, 100);
    const page = parseInt(searchParams.get('page')) || 1;

    const query = {};
    if (search.trim()) {
      const rx = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ title: rx }, { 'specs.brand': rx }, { slug: rx }];
    }

    const skip = (page - 1) * limit;
    const collection = db.collection('inventory');

    const [cars, total] = await Promise.all([
      collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query),
    ]);

    return NextResponse.json({
      cars: cars.map((c) => ({ ...c, _id: c._id.toString() })),
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Admin cars GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

// POST: Create new car
export async function POST(request) {
  try {
    const db = await connectDB();
    const data = await request.json();

    if (!data.title || !data.specs?.brand) {
      return NextResponse.json(
        { error: 'Title and brand are required' },
        { status: 400 }
      );
    }

    // Auto slug
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }

    // Check duplicate slug
    const existing = await db.collection('inventory').findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { error: 'A car with this slug already exists' },
        { status: 409 }
      );
    }

    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.status = data.status || 'available';
    data.viewCount = data.viewCount || 0;
    data.isFeatured = data.isFeatured || false;

    const result = await db.collection('inventory').insertOne(data);

    return NextResponse.json(
      { car: { _id: result.insertedId.toString(), ...data } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin cars POST error:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}