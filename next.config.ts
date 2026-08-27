import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      // Fotos de produtos hospedadas no Firebase Storage
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
  // Content-Security-Policy fica de fora por enquanto: exige mapear todos os
  // domínios do Firebase, GA4 e Google Fonts com cuidado antes de travar
  // scripts em produção. Ver docs/ESPECIFICACAO.md.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
