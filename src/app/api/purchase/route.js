import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '../auth/[...nextauth]/route'; // Ensure you have exported authOptions or use generic one

/**
 * POST /api/purchase - Process a purchase
 */
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const data = await request.json();
    
    const { carId, paymentType, emiDetails } = data;
    
    let objectId;
    try {
      objectId = new ObjectId(carId);
    } catch(e) {
      return NextResponse.json({ error: 'Invalid car ID format' }, { status: 400 });
    }
    
    // Get car details
    const car = await db.collection('cars').findOne({ _id: objectId });
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    if (car.status !== 'available') {
      return NextResponse.json({ error: 'Car is not available' }, { status: 400 });
    }

    // Process based on payment type
    let orderData = {
      userId: session.user.id,
      carId: car._id.toString(),
      carTitle: car.title,
      amount: car.price,
      paymentType,
      status: 'pending',
      purchaseDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (paymentType === 'full') {
      // Full payment
      orderData.status = 'completed';
      
      // Update car status
      await db.collection('cars').updateOne(
        { _id: objectId },
        { $set: { status: 'sold', updatedAt: new Date() } }
      );
      
    } else if (paymentType === 'emi') {
      // EMI payment
      const emi = {
        userId: session.user.id,
        carId: car._id.toString(),
        totalAmount: car.price,
        downPayment: emiDetails.downPayment,
        loanAmount: car.price - emiDetails.downPayment,
        tenureMonths: emiDetails.tenure,
        interestRate: emiDetails.interestRate,
        monthlyPayment: emiDetails.monthlyPayment,
        totalPaid: emiDetails.downPayment,
        remainingBalance: car.price - emiDetails.downPayment,
        emiDueDate: new Date(),
        nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const emiResult = await db.collection('emis').insertOne(emi);
      orderData.emiId = emiResult.insertedId.toString();
      
      // Update car status
      await db.collection('cars').updateOne(
        { _id: objectId },
        { $set: { status: 'reserved', updatedAt: new Date() } }
      );
    }

    // Create order
    const orderResult = await db.collection('orders').insertOne(orderData);
    orderData._id = orderResult.insertedId;

    return NextResponse.json({ 
      message: 'Purchase successful', 
      order: orderData,
      emi: orderData.emiId || null,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}