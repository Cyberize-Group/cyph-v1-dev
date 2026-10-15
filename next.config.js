/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Do not let `next dev` write the managed agent-rules block into CLAUDE.md / AGENTS.md
  // (root CLAUDE.md is the protected workflow entry; VIK round-two amendment, 2026-10-14).
  agentRules: false,
  async headers() {
    return [
      {
        source: "/((?!_next/static/).*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
