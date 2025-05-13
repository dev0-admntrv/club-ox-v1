"use client"

import { useSearchParams } from "next/navigation"
import { EmbeddedWebView } from "@/components/embedded-web-view"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EmbeddedPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")
  const title = searchParams.get("title") || "Visualização Externa"
  const router = useRouter()

  useEffect(() => {
    if (!url) {
      router.push("/home")
    }
  }, [url, router])

  if (!url) {
    return null
  }

  return <EmbeddedWebView url={url} title={title} />
}
