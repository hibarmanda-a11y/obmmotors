import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { deleteFromR2, extractKeyFromUrl } from '@/lib/r2';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const db = await connectDB();
    const { status } = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const result = await db.collection('sell-deals').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error('Admin sell PUT error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await connectDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const deal = await db.collection('sell-deals').findOne({ _id: new ObjectId(id) });
    if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete R2 images
    if (Array.isArray(deal.images)) {
      await Promise.allSettled(
        deal.images.map(async (url) => {
          const key = extractKeyFromUrl(url);
          if (key) {
            try { await deleteFromR2(key); } catch (e) { console.error(e); }
          }
        })
      );
    }

    await db.collection('sell-deals').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin sell DELETE error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}