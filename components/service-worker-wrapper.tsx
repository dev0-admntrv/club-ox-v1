"use client"

import dynamic from "next/dynamic"

// Usando dynamic import com ssr: false em um componente cliente
const ServiceWorkerRegistration = dynamic(
  () => import("@/components/service-worker-registration").then((mod) => mod.ServiceWorkerRegistration),
  { ssr: false },
)

export function ServiceWorkerWrapper() {
  return <ServiceWorkerRegistration />
}
