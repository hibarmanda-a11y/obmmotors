import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { formatCar } from '../formatCar';
import ImageGallery from './ImageGallery';
import SuggestedCars from './SuggestedCars';

async function getCarBySlug(slug) {
  const db = await connectDB();
  const collection = db.collection('inventory');
  const car = await collection.findOne({ slug });
  return car ? formatCar(car) : null;
}

async function getSuggestedCars(brand, currentSlug) {
  const db = await connectDB();
  const collection = db.collection('inventory');

  const cars = await collection
    .find({
      'specs.brand': brand,
      slug: { $ne: currentSlug },
    })
    .limit(12)
    .toArray();

  return cars;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return {};
  return {
    title: `${car.title} | OB Motors`,
    description: car.description || `View details for ${car.title}`,
  };
}

export default async function CarDetailPage({ params }) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  // ✅ Suggested cars — same brand, current car baad
  const suggestedCars = await getSuggestedCars(car.brand, slug);

  const allImages = [car.thumbnail, ...(car.relatedImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-xs text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/cars" className="hover:text-white">Cars</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{car.title}</span>
          </nav>
        </div>
      </div>

      {/* Brand Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center">
          <span className="text-sm font-bold tracking-widest text-white/80">
            🚗 OB MOTORS
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Image Gallery */}
        <ImageGallery images={allImages} alt={car.title} />

        {/* Title + Share */}
        <div className="flex items-start justify-between mt-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {car.title}
          </h1>
          <button
            type="button"
            className="shrink-0 flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-white/20 text-white/80 hover:border-white/60 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* LEFT: Specs + Description + Features */}
          <div className="flex-1 min-w-0">
            {/* Specs Grid */}
            <div className="bg-white/5 border border-white/10 p-5 mb-8">
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5">
                <SpecItem label="Brand" value={car.brand} />
                <SpecItem label="Model" value={car.model} />
                <SpecItem label="Reg. Year" value={car.year} />
                <SpecItem label="Mileage" value={car.mileage} />
                <SpecItem label="Engine (CC)" value={car.engine} />
                <SpecItem label="Transmission" value={car.transmission} />
                <SpecItem label="Fuel Type" value={car.fuelType} />
                <SpecItem label="Drive Type" value={car.driveType} />
                <SpecItem label="Wheel" value={car.wheel} />
                <SpecItem label="Exterior" value={car.exteriorColor} />
                <SpecItem label="Body Style" value={car.bodyStyle} />
              </dl>
            </div>

            {/* Description */}
            {car.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-3">Description</h2>
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                  {car.description}
                </p>
              </div>
            )}

            {/* Engine Details */}
            {car.engineDetails?.length > 0 && (
              <FeatureList title="Engine & Performance" items={car.engineDetails} />
            )}

            {/* Exterior Features */}
            {car.exteriorFeatures?.length > 0 && (
              <FeatureList title="Exterior Features" items={car.exteriorFeatures} />
            )}

            {/* Interior Features */}
            {car.interiorFeatures?.length > 0 && (
              <FeatureList title="Interior Features" items={car.interiorFeatures} />
            )}

            {/* Safety Features */}
            {car.safetyFeatures?.length > 0 && (
              <FeatureList title="Safety Features" items={car.safetyFeatures} />
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-6 space-y-4">
              {/* Contact Card */}
              <div className="bg-white/5 border border-white/10 p-5">
                <h2 className="text-2xl font-bold text-white">
                  {car.priceDisplay}
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  *Price may be slightly negotiable
                </p>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-white mb-1">
                    Need help making a choice?
                  </p>
                  <p className="text-xs text-white/60 mb-4">
                    Our expert sales team is here to assist you.
                  </p>
                </div>

                <div className="space-y-2">
                  <button className="w-full py-2.5 bg-orange-200 text-gray-900 text-sm font-semibold hover:bg-orange-300 transition-colors">
                    Call Us
                  </button>
                  <button className="w-full py-2.5 bg-orange-100 text-gray-900 text-sm font-semibold hover:bg-orange-200 transition-colors">
                    Text Us on WhatsApp
                  </button>
                  <button className="w-full py-2.5 bg-orange-200 text-gray-900 text-sm font-semibold hover:bg-orange-300 transition-colors">
                    Get a Quote
                  </button>
                </div>
              </div>

              {/* Book Appointment */}
              <button className="w-full py-3 bg-white/10 border border-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                Book an Appointment
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Suggested Cars — ei section ta main content er shesh e */}
        <SuggestedCars cars={suggestedCars} currentSlug={slug} />
      </div>
    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-white/50">{label}</dt>
      <dd className="text-sm font-semibold text-white mt-0.5">
        {value || 'N/A'}
      </dd>
    </div>
  );
}

function FeatureList({ title, items }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-bold text-white mb-3">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-white/70 flex gap-2">
            <span className="text-white/40 shrink-0">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}