import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: "./utils/empty-module.ts",
    },
  },
};

export default nextConfig;