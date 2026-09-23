import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const db = await connectDB();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const brand = searchParams.get('brand') || '';
    const model = searchParams.get('model') || '';
    const bodyStyle = searchParams.get('bodyStyle') || '';
    const fuelType = searchParams.get('fuelType') || '';
    const transmission = searchParams.get('transmission') || '';
    const driveType = searchParams.get('driveType') || '';
    const condition = searchParams.get('condition') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit')) || 12, 50);
    const page = parseInt(searchParams.get('page')) || 1;

    // ✅ Build Query
    const query = {};

    if (featured) query.isFeatured = true;

    // Text search
    if (search.trim()) {
      const rx = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: rx },
        { 'specs.brand': rx },
        { 'specs.model': rx },
      ];
    }

    // ✅ Filters
    if (brand && brand !== 'All Brands') query['specs.brand'] = brand;
    if (model.trim()) query['specs.model'] = { $regex: model.trim(), $options: 'i' };
    if (bodyStyle && bodyStyle !== 'All Body Styles') query['specs.body_style'] = bodyStyle;
    if (fuelType && fuelType !== 'All Fuel Types') query['specs.fuel_type'] = fuelType;
    if (transmission && transmission !== 'All Transmissions') query['specs.transmission'] = transmission;
    if (driveType && driveType !== 'All Drive Types') query['specs.drive_type'] = driveType;
    if (condition && condition !== 'All Conditions') query['specs.condition'] = condition;

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // ✅ Sort
    let sortOptions = {};
    switch (sort) {
      case 'price-low':   sortOptions = { price: 1, _id: -1 }; break;
      case 'price-high':  sortOptions = { price: -1, _id: -1 }; break;
      case 'popular':     sortOptions = { viewCount: -1, _id: -1 }; break;
      case 'oldest':      sortOptions = { _id: 1 }; break;
      default:            sortOptions = { _id: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const collection = db.collection('inventory');

    const [cars, total] = await Promise.all([
      collection.find(query).sort(sortOptions).skip(skip).limit(limit).toArray(),
      collection.countDocuments(query),
    ]);

    return NextResponse.json({
      cars,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = await connectDB();
    const data = await request.json();

    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.status = data.status || 'available';
    data.viewCount = data.viewCount || 0;
    data.isFeatured = data.isFeatured || false;

    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    if (!data.priceDisplay && typeof data.price === 'number') {
      data.priceDisplay = `$${data.price.toLocaleString()}`;
    }

    const result = await db.collection('inventory').insertOne(data);
    const car = { _id: result.insertedId, ...data };

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json(
      { error: 'Failed to create car' },
      { status: 500 }
    );
  }
}