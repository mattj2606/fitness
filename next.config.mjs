/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for better development experience
  reactStrictMode: true,

  // Optimize for production


  // Image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Enable experimental features if needed
  experimental: {
    // Enable if using server actions
    // serverActions: true,
  },

  // Compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // Output configuration (for self-hosting)
  // swcMinify is enabled by default in Next.js 13+
  output: "standalone",

  // Environment variables
  env: {
    // Add any public env vars here
  },

  // Headers for security and PWA
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

// PWA configuration will be added when next-pwa is installed
// Uncomment and configure when ready for Phase 2:
// import withPWA from "next-pwa";
//
// export default withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   runtimeCaching: [
//     {
//       urlPattern: /^https?.*/,
//       handler: "NetworkFirst",
//       options: {
//         cacheName: "offlineCache",
//         expiration: {
//           maxEntries: 200,
//         },
//       },
//     },
//   ],
// })(nextConfig);

export default nextConfig;

