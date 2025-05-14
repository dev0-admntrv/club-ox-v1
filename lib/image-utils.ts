export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: "webp" | "avif" | "auto"
    fallback?: string
  } = {},
): string {
  const { width = 800, height = 600, quality = 80, format = "webp", fallback = "/placeholder.svg?key=9appn" } = options

  if (!url) return fallback

  // If it's already a placeholder URL, return it
  if (url.includes("/placeholder.svg")) return url

  // If it's a relative URL (starts with /)
  if (url.startsWith("/")) {
    // For local images, we can't transform them here
    // Just return the original URL
    return url
  }

  // For external URLs, we could use an image optimization service
  // This is a simplified example - in production you might use Imgix, Cloudinary, etc.
  try {
    const urlObj = new URL(url)

    // If it's already using an image optimization service, return as is
    if (
      urlObj.hostname.includes("imagedelivery.net") ||
      urlObj.hostname.includes("cloudinary.com") ||
      urlObj.hostname.includes("imgix.net")
    ) {
      return url
    }

    // For demo purposes, we'll just return the original URL
    // In a real app, you'd transform this URL to use your image optimization service
    return url
  } catch (e) {
    // If URL parsing fails, return the fallback
    console.error("Invalid image URL:", url)
    return fallback
  }
}

export function generatePlaceholderUrl(width = 800, height = 600, query = "abstract"): string {
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
}
