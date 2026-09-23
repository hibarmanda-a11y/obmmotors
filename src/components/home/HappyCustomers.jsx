"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HappyCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/happy-customers");
        const data = await res.json();
        if (!cancelled) setCustomers((data.customers || []).slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-black py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Happy Customers
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Real people, real experiences
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {customers.map((c) => (
              <div
                key={c._id}
                className="relative aspect-[4/5] bg-white/5 overflow-hidden group"
              >
                <Image
                  src={c.image}
                  alt={`${c.ownerName} - ${c.model}`}
                  fill
                  quality={100}
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-[10px] text-white/60 uppercase tracking-wide truncate">
                    {c.ownerName}
                  </p>
                  <p className="text-[11px] font-semibold text-white truncate">
                    {c.model}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/happy-customer"
            className="inline-flex rounded-2xl items-center gap-2 px-6 py-3 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors"
          >
            View More
           
          </Link>
        </div>
      </div>
    </section>
  );
}
