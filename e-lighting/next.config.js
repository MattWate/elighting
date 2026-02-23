/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables the App Router and advanced features
  reactStrictMode: true,
  
  // Allowing external images (Essential for your Supabase/Unsplash images)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows images from any secure source
      },
    ],
  },

  // Ensures your build outputs are handled correctly by Netlify
  output: 'standalone', 
};

module.exports = nextConfig;
