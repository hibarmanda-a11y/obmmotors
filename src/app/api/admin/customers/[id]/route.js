import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { deleteFromR2, extractKeyFromUrl } from '@/lib/r2';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const db = await connectDB();
    const data = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    delete data._id;

    const result = await db.collection('happy-customer').updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Admin customer PUT error:', error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const customer = await db.collection('happy-customer').findOne({
      _id: new ObjectId(id),
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Delete R2 image
    if (customer.image) {
      const key = extractKeyFromUrl(customer.image);
      if (key) {
        try {
          await deleteFromR2(key);
        } catch (err) {
          console.error('R2 delete failed:', err.message);
        }
      }
    }

    await db.collection('happy-customer').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin customer DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}