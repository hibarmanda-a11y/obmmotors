import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET /api/emi - Fetch user's EMI details
 */
export async function GET(request) {
  try {
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const db = await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const query = {};
    if (userId) query.userId = userId;
    
    const emis = await db.collection('emis')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Manually populate carId and userId
    const populatedEmis = await Promise.all(emis.map(async (emi) => {
      let car = null;
      let user = null;
      try {
        if (emi.carId) {
          const carIdObj = new ObjectId(emi.carId);
          car = await db.collection('cars').findOne(
            { _id: carIdObj },
            { projection: { title: 1, price: 1 } }
          );
        }
      } catch(e) {}
      
      try {
        if (emi.userId) {
          const userIdObj = new ObjectId(emi.userId);
          user = await db.collection('users').findOne(
            { _id: userIdObj },
            { projection: { name: 1, email: 1 } }
          );
        }
      } catch(e) {}
      
      return {
        ...emi,
        carId: car || emi.carId,
        userId: user || emi.userId
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
 * POST /api/emi - Create new EMI
 */
export async function POST(request) {
  try {
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const db = await connectDB();
    const data = await request.json();
    
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