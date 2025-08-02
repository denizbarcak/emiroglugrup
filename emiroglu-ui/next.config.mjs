/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:8080",
    NEXT_PUBLIC_ASSETS_URL: "http://localhost:8080",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
      {
        source: "/assets/:path*",
        destination: "http://localhost:8080/assets/:path*",
      },
    ];
  },
};

export default nextConfig;
