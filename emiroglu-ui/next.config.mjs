/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://135.181.249.171:8080",
    NEXT_PUBLIC_ASSETS_URL: "http://135.181.249.171:8080",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://135.181.249.171:8080/api/:path*",
      },
      {
        source: "/assets/:path*",
        destination: "http://135.181.249.171:8080/assets/:path*",
      },
    ];
  },
};

export default nextConfig;
