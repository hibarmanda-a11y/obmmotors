import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

/**
 * GET /api/cars - Fetch cars with filters, sorting, and pagination
 */
export async function GET(request) {
  try {
    const db = await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const make = searchParams.get('make') || '';
    const condition = searchParams.get('condition') || '';
    const fuelType = searchParams.get('fuelType') || '';
    const priceRange = searchParams.get('priceRange') || '';
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;

    // Build query
    const query = { status: 'available' };
    
    if (featured) {
      query.isFeatured = true;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (make && make !== 'All Makes') {
      query.make = make;
    }

    if (condition && condition !== 'All Conditions') {
      query.condition = condition;
    }

    if (fuelType && fuelType !== 'All Fuel Types') {
      query.fuelType = fuelType;
    }

    if (priceRange && priceRange !== 'All Prices') {
      const ranges = {
        'Under $50,000': { $lt: 50000 },
        '$50,000-$100,000': { $gte: 50000, $lte: 100000 },
        '$100,000-$200,000': { $gte: 100000, $lte: 200000 },
        'Over $200,000': { $gt: 200000 },
      };
      if (ranges[priceRange]) {
        query.price = ranges[priceRange];
      }
    }

    // Build sort
    let sortOptions = {};
    switch (sort) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'popular':
        sortOptions = { viewCount: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // IMPORTANT: Use 'buy' collection instead of 'cars'
    const collection = db.collection('buy');
    
    // Execute query
    const cars = await collection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const total = await collection.countDocuments(query);

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

/**
 * POST /api/cars - Create a new car listing (Admin only)
 */
export async function POST(request) {
  try {
    const db = await connectDB();
    const data = await request.json();
    
    data.createdAt = new Date();
    data.updatedAt = new Date();
    
    // IMPORTANT: Use 'buy' collection
    const result = await db.collection('buy').insertOne(data);
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