'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/10] bg-white/5 flex items-center justify-center text-white/40">
        No images available
      </div>
    );
  }

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () =>
    setLightboxIndex((i) => (i + 1) % images.length);
  const prevImage = () =>
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);

  const mainImage = images[activeIndex];
  const sideThumbs = images.slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Main Image (left, big) */}
        <button
          type="button"
          onClick={() => openLightbox(activeIndex)}
          className="relative aspect-[4/3] bg-white/5 overflow-hidden cursor-zoom-in md:col-span-1"
        >
          <Image
            src={mainImage}
            alt={alt}
            fill
            priority
            quality={100}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </button>

        {/* Right side: 4 thumbnails grid (2x2) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {sideThumbs.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => openLightbox(index)}
              className="relative aspect-[4/3] bg-white/5 overflow-hidden group"
            >
              <Image
                src={src}
                alt={`${alt} - Image ${index + 1}`}
                fill
                quality={100}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {index === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-sm font-bold">
                  +{images.length - 4}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 text-white p-2 hover:bg-white/10"
            aria-label="Close"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 text-white text-sm font-semibold bg-black/50 px-3 py-1.5">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 z-10 text-white p-3 hover:bg-white/10"
            aria-label="Previous"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image (original size, full quality) */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${alt} - Image ${lightboxIndex + 1}`}
              fill
              priority
              quality={100}
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 z-10 text-white p-3 hover:bg-white/10"
            aria-label="Next"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}