import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';

export const metadata = {
  title: 'Happy Customers | OB Motors',
  description: 'Real people, real experiences with OB Motors.',
};

async function getCustomers() {
  const db = await connectDB();
  const collection = db.collection('happy-customer');
  const customers = await collection.find({}).sort({ createdAt: -1 }).toArray();

  return customers.map((c) => ({
    _id: c._id?.toString(),
    image: c.image,
    ownerName: c.ownerName,
    model: c.model,
  }));
}

export default async function HappyCustomerPage() {
  const customers = await getCustomers();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="text-xs text-white/50 mb-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Happy Customers</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Happy Customers
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Real people, real experiences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {customers.length === 0 ? (
          <div className="text-center py-20 border border-white/10">
            <p className="text-lg font-semibold text-white">No customers yet</p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
            {customers.map((c) => (
              <div
                key={c._id}
                className="relative break-inside-avoid mb-3 overflow-hidden bg-white/5 group"
              >
                <Image
                  src={c.image}
                  alt={`${c.ownerName} - ${c.model}`}
                  width={600}
                  height={800}
                  quality={100}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[10px] sm:text-[11px] text-white/60 uppercase tracking-wide truncate">
                    {c.ownerName}
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-white truncate">
                    {c.model}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}