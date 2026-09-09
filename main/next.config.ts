import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_PRICE: process.env.BASE_PRICE || "",
    NEXT_PUBLIC_BASE_PRICE: process.env.NEXT_PUBLIC_BASE_PRICE || process.env.BASE_PRICE || "",
  },
};

export default nextConfig;
