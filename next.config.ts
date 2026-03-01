import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      type: "asset/resource",
      generator: { filename: "static/media/[name].[hash][ext]" },
    });
    return config;
  },
};

const withMDX = createMDX();
export default withMDX(nextConfig);
