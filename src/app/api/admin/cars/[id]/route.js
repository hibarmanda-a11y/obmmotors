import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { deleteFromR2, extractKeyFromUrl } from '@/lib/r2';

// GET: Single car
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await connectDB();

    const car = await db.collection('inventory').findOne({ _id: new ObjectId(id) });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ car: { ...car, _id: car._id.toString() } });
  } catch (error) {
    console.error('Admin car GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

// PUT: Update car
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const db = await connectDB();
    const data = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    delete data._id;
    data.updatedAt = new Date();

    const result = await db.collection('inventory').updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Admin car PUT error:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

// DELETE: Delete car + R2 images
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const car = await db.collection('inventory').findOne({ _id: new ObjectId(id) });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // Delete R2 images (fire and forget)
    const urlsToDelete = [car.thumbnail, ...(car.related_images || [])].filter(Boolean);
    await Promise.allSettled(
      urlsToDelete.map(async (url) => {
        const key = extractKeyFromUrl(url);
        if (key) {
          try {
            await deleteFromR2(key);
          } catch (err) {
            console.error('R2 delete failed for', key, err.message);
          }
        }
      })
    );

    // Delete from MongoDB
    await db.collection('inventory').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin car DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}