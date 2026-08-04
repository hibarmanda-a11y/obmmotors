import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

/**
 * POST /api/sell - Submit a sell request
 */
export async function POST(request) {
  try {
    const db = await connectDB();
    const data = await request.json();

    data.createdAt = new Date();
    data.updatedAt = new Date();
    
    if (!data.status) {
      data.status = 'pending';
    }

    const result = await db.collection('sellRequests').insertOne(data);

    // Here you would also send email notification to admin
    
    return NextResponse.json(
      { message: 'Sell request submitted successfully', id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting sell request:', error);
    return NextResponse.json(
      { error: 'Failed to submit sell request' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sell - Fetch sell requests (Admin only)
 */
export async function GET(request) {
  try {
    // Check if user is admin
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const db = await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    
    const query = {};
    if (status) query.status = status;

    const requests = await db.collection('sellRequests')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching sell requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sell requests' },
      { status: 500 }
    );
  }
}