import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

/**
 * POST /api/upload - Upload image to Cloudinary
 */
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const result = await uploadToCloudinary(image, 'car_selling');
    
    return NextResponse.json({ 
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}