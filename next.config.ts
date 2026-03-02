import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack from bundling Prisma so .prisma/client/default resolves at runtime
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
