/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      // Supabase storage - all subdomains under supabase.co
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      // Specific Supabase bucket pattern
      {
        protocol: "https",
        hostname: "supabase.co",
      },
      // Unsplash fallback
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Allow localhost for development
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
