// /app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '../../auth/[...nextauth]/route';

/**
 * GET /api/user/profile - Get current user profile
 */
export async function GET() {
  try {
    // FIX: Pass authOptions to getServerSession
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    
    // Check if session.user.id exists
    if (!session.user?.id) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }
    
    let objectId;
    try {
      objectId = new ObjectId(session.user.id);
    } catch(e) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    const user = await db.collection('users').findOne(
      { _id: objectId },
      { projection: { password: 0, resetPasswordToken: 0, resetPasswordExpires: 0 } }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data with consistent structure
    return NextResponse.json({ 
      success: true,
      user: user 
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile - Update user profile
 */
export async function PUT(request) {
  try {
    // FIX: Pass authOptions to getServerSession
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const data = await request.json();
    
    if (!session.user?.id) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }
    
    let objectId;
    try {
      objectId = new ObjectId(session.user.id);
    } catch(e) {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    // Prevent updating sensitive fields
    delete data.password;
    delete data.role;
    delete data._id;
    delete data.email; // Prevent email updates
    
    const result = await db.collection('users').findOneAndUpdate(
      { _id: objectId },
      { 
        $set: {
          ...data,
          updatedAt: new Date() 
        }
      },
      { 
        returnDocument: 'after',
        projection: { password: 0, resetPasswordToken: 0, resetPasswordExpiry: 0 } 
      }
    );

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      user: result 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}