import Link from 'next/link';
import Image from 'next/image';
import { formatCar } from './formatCar';

export default function CarCard({ car }) {
  const c = formatCar(car);
  if (!c) return null;

  return (
    <Link
      href={`/cars/${c.slug}`}
      className="group block bg-white/5 border border-white/10 hover:border-white/40 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-white/5 overflow-hidden">
        <Image
          src={c.thumbnail}
          alt={c.title}
          fill
          quality={100}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {c.isFeatured && (
          <span className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold uppercase tracking-wide px-2 py-1">
            Featured
          </span>
        )}
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-white/50 uppercase tracking-wide">
          <span className="font-semibold">{c.brand}</span>
          <span>{c.year}</span>
        </div>

        <h3 className="text-sm font-semibold text-white line-clamp-1 leading-snug">
          {c.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/60">
          <span>{c.mileage}</span>
          <span className="w-1 h-1 bg-white/20 rounded-full"></span>
          <span>{c.fuelType}</span>
          <span className="w-1 h-1 bg-white/20 rounded-full"></span>
          <span>{c.transmission}</span>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-base font-bold text-white">
            {c.priceDisplay}
          </span>
          <span className="text-[11px] text-white/50">{c.bodyStyle}</span>
        </div>
      </div>
    </Link>
  );
}