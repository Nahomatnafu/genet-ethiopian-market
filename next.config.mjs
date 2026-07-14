/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Placeholder stock photography — remove once all images are client-owned
      { protocol: "https", hostname: "images.unsplash.com" },
      // Cloudinary, for when the client wires up their account later
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
