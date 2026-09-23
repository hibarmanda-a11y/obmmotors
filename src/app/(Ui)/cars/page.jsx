import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import CarCard from './CarCard';
import CarsFilters from './CarsFilters';
import CarsToolbar from './CarsToolbar';
import CarsPagination from './CarsPagination';

export const metadata = {
  title: 'All Cars | OB Motors',
  description: 'Browse our complete inventory of premium cars.',
};

async function getCars(params) {
  const db = await connectDB();
  const collection = db.collection('inventory');

  const query = {};
  const search = params.search || '';
  const brand = params.brand || '';
  const model = params.model || '';
  const bodyStyle = params.bodyStyle || '';
  const fuelType = params.fuelType || '';
  const transmission = params.transmission || '';
  const driveType = params.driveType || '';
  const condition = params.condition || '';
  const minPrice = params.minPrice || '';
  const maxPrice = params.maxPrice || '';
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = 9;

  if (search.trim()) {
    const rx = { $regex: search.trim(), $options: 'i' };
    query.$or = [
      { title: rx },
      { 'specs.brand': rx },
      { 'specs.model': rx },
    ];
  }

  if (brand) query['specs.brand'] = brand;
  if (model.trim()) query['specs.model'] = { $regex: model.trim(), $options: 'i' };
  if (bodyStyle) query['specs.body_style'] = bodyStyle;
  if (fuelType) query['specs.fuel_type'] = fuelType;
  if (transmission) query['specs.transmission'] = transmission;
  if (driveType) query['specs.drive_type'] = driveType;
  if (condition) query['specs.condition'] = condition;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }

  const sortOptions = { _id: -1 };
  const skip = (page - 1) * limit;

  const [cars, total] = await Promise.all([
    collection.find(query).sort(sortOptions).skip(skip).limit(limit).toArray(),
    collection.countDocuments(query),
  ]);

  return {
    cars,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export default async function CarsPage({ searchParams }) {
  const params = (await searchParams) || {};
  const { cars, total, page, totalPages } = await getCars(params);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="text-xs text-white/50 mb-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Cars</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            All Cars
          </h1>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <CarsFilters variant="sidebar" />

          <div className="flex-1 min-w-0">
            <CarsToolbar currentSearch={params.search || ''} />

            {cars.length === 0 ? (
              <div className="text-center py-20 border border-white/10">
                <p className="text-lg font-semibold text-white">No cars found</p>
                <p className="text-sm text-white/50 mt-2">
                  Try adjusting your filters or search.
                </p>
                <Link
                  href="/cars"
                  className="inline-block mt-5 px-5 py-2 bg-white text-black text-sm font-semibold hover:bg-white/90"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cars.map((car) => (
                    <CarCard key={car._id?.toString()} car={car} />
                  ))}
                </div>

                <CarsPagination
                  page={page}
                  totalPages={totalPages}
                  searchParams={params}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}