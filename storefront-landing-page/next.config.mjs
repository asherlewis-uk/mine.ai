/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This is the trigger for the 'out' folder
  images: {
    unoptimized: true, // Mandatory: Static sites can't use the dynamic image optimizer
  },
};

export default nextConfig;