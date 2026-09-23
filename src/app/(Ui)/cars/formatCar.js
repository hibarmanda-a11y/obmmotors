export function formatCar(car) {
  if (!car) return null;

  const specs = car.specs || {};

  return {
    id: car._id?.toString() || '',
    slug: car.slug || car._id?.toString() || '',
    title: car.title || 'Untitled',
    brand: specs.brand || 'Unknown',
    model: specs.model || '',
    year: specs.reg_year || '',
    mileage: specs.mileage || 'N/A',
    engine: specs.engine_cc || 'N/A',
    transmission: specs.transmission || 'N/A',
    fuelType: specs.fuel_type || 'N/A',
    driveType: specs.drive_type || 'N/A',
    bodyStyle: specs.body_style || 'N/A',
    exteriorColor: specs.exterior_color || 'N/A',
    wheel: specs.wheel || 'N/A',
    thumbnail: car.thumbnail || '/placeholder-car.webp',
    relatedImages: Array.isArray(car.related_images) ? car.related_images : [],
    price: typeof car.price === 'number' ? car.price : null,
    priceDisplay:
      car.priceDisplay ||
      (typeof car.price === 'number'
        ? `$${car.price.toLocaleString()}`
        : 'Contact for Price'),
    isFeatured: Boolean(car.isFeatured),
    viewCount: car.viewCount || 0,

    // Detail page fields
    description: car.description || '',
    engineDetails: Array.isArray(car.engine_details) ? car.engine_details : [],
    exteriorFeatures: Array.isArray(car.exterior_features) ? car.exterior_features : [],
    interiorFeatures: Array.isArray(car.interior_features) ? car.interior_features : [],
    safetyFeatures: Array.isArray(car.safety_features) ? car.safety_features : [],
    videoUrl: car.video_url || '',
  };
}

export function formatCars(cars) {
  if (!Array.isArray(cars)) return [];
  return cars.map(formatCar).filter(Boolean);
}