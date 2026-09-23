/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        port: "",
        pathname: "/**",
      },
       {
        protocol: 'https',
        hostname: 'pub-e0e9f01f43bc49d4b1a163b4445cebb4.r2.dev',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "iili.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
    // ✅ ADD: Sizes configuration for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 5120, 7680],

    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90, 100],
    formats: ["image/webp"],

    minimumCacheTTL: 60,
  },
  experimental: {
    // ✅ FIX: serverActions should be an object
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
