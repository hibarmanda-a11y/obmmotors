import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { uploadToR2, generateSlug } from '@/lib/r2';
import { sendSellConfirmation } from '@/lib/email';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get('name')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const carName = formData.get('carName')?.toString().trim();
    const model = formData.get('model')?.toString().trim();
    const regYear = formData.get('regYear')?.toString().trim();
    const mileage = formData.get('mileage')?.toString().trim();
    const offeredPrice = formData.get('offeredPrice')?.toString().trim();
    const acceptedTerms = formData.get('acceptedTerms') === 'true';
    const files = formData.getAll('images');

    // Validation
    if (!name || !phone || !email || !carName || !regYear) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!acceptedTerms) {
      return NextResponse.json(
        { error: 'You must accept the Terms of Use' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    // Upload images to R2
    const slug = generateSlug(`${carName}-${phone}`);
    const uploadedUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file === 'string') continue;

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}` },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File too large: ${file.name} (max 10MB)` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split('.').pop().toLowerCase() || 'jpg';
      const key = `sell-deals/${slug}/${Date.now()}-${i + 1}.${ext}`;

      const url = await uploadToR2(buffer, key, file.type);
      uploadedUrls.push(url);
    }

    // Save to MongoDB
    const db = await connectDB();
    const collection = db.collection('sell-deals');

    const deal = {
      name,
      phone,
      email,
      carName,
      model,
      regYear,
      mileage,
      offeredPrice,
      acceptedTerms: true,
      images: uploadedUrls,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(deal);

    // Send confirmation email (fire and forget)
    let emailStatus = 'sent';
    try {
      const emailResult = await sendSellConfirmation({
        name: deal.name,
        email: deal.email,
        phone: deal.phone,
        carName: deal.carName,
        model: deal.model,
        regYear: deal.regYear,
        mileage: deal.mileage,
        offeredPrice: deal.offeredPrice,
        images: deal.images,
      });

      if (!emailResult.success) {
        emailStatus = 'failed';
        console.error('Email failed:', emailResult.error);
      }
    } catch (emailErr) {
      emailStatus = 'failed';
      console.error('Email error:', emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        deal: { _id: result.insertedId.toString(), ...deal },
        emailStatus,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sell API error:', error);
    return NextResponse.json(
      { error: error.message || 'Submission failed' },
      { status: 500 }
    );
  }
}