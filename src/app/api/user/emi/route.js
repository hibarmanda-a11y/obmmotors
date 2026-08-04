import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust path if you have a separate auth options file

/**
 * GET /api/user/emi - Get user's EMI details
 */
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    
    const emis = await db.collection('emis')
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();
      
    // Manually populate car details
    const populatedEmis = await Promise.all(emis.map(async (emi) => {
      let car = null;
      try {
        const carId = new ObjectId(emi.carId);
        car = await db.collection('cars').findOne(
          { _id: carId },
          { projection: { title: 1, price: 1 } }
        );
      } catch(e) {}
      
      return {
        ...emi,
        carId: car || emi.carId
      };
    }));

    return NextResponse.json({ emi: populatedEmis });
  } catch (error) {
    console.error('Error fetching EMI:', error);
    return NextResponse.json(
      { error: 'Failed to fetch EMI details' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/emi - Create new EMI
 */
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const data = await request.json();
    
    data.userId = session.user.id;
    data.createdAt = new Date();
    data.updatedAt = new Date();
    
    const result = await db.collection('emis').insertOne(data);
    const emi = { _id: result.insertedId, ...data };

    return NextResponse.json({ emi }, { status: 201 });
  } catch (error) {
    console.error('Error creating EMI:', error);
    return NextResponse.json(
      { error: 'Failed to create EMI' },
      { status: 500 }
    );
  }
}