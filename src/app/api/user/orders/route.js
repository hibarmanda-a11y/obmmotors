import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust path if you have a separate auth options file

/**
 * GET /api/user/orders - Get user's orders
 */
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    
    const orders = await db.collection('orders')
      .find({ userId: session.user.id })
      .sort({ purchaseDate: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}