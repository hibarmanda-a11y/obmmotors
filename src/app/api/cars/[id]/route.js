import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET /api/cars/[id] - Fetch single car details
 */
export async function GET(request, { params }) {
  try {
    // ✅ FIX: Await params before accessing its properties
    const { id } = await params;
    
    const db = await connectDB();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid car ID format' }, { status: 400 });
    }
    
    // Use 'buy' collection
    const car = await db.collection('buy').findOne({ _id: objectId });
    
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // Increment view count
    await db.collection('buy').updateOne(
      { _id: objectId },
      { $inc: { viewCount: 1 } }
    );

    return NextResponse.json({ car });
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cars/[id] - Update car details (Admin only)
 */
export async function PUT(request, { params }) {
  try {
    // ✅ FIX: Await params before accessing its properties
    const { id } = await params;
    
    const db = await connectDB();
    const data = await request.json();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid car ID format' }, { status: 400 });
    }
    
    if (data._id) {
      delete data._id;
    }
    
    const result = await db.collection('buy').findOneAndUpdate(
      { _id: objectId },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ car: result });
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json(
      { error: 'Failed to update car' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cars/[id] - Delete car (Admin only)
 */
export async function DELETE(request, { params }) {
  try {
    // ✅ FIX: Await params before accessing its properties
    const { id } = await params;
    
    const db = await connectDB();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid car ID format' }, { status: 400 });
    }
    
    const result = await db.collection('buy').findOneAndDelete({ _id: objectId });
    
    if (!result) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { error: 'Failed to delete car' },
      { status: 500 }
    );
  }
}