import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Club OX - Programa de Fidelidade",
    short_name: "Club OX",
    description: "Aplicativo de fidelidade premium da OX Steakhouse",
    start_url: "/",
    display: "standalone",
    background_color: "#1c1917",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
