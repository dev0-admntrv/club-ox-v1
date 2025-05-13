/**
 * Generates a placeholder image URL with the specified dimensions and query
 * @param width The width of the placeholder image
 * @param height The height of the placeholder image
 * @param query The description of the image content
 * @returns A URL string for the placeholder image
 */
export function getPlaceholderImage(width: number, height: number, query: string): string {
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
}

/**
 * Checks if a URL is external (not relative)
 * @param url The URL to check
 * @returns Boolean indicating if the URL is external
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")
}

/**
 * Gets appropriate sizes attribute for responsive images based on container width
 * @param containerWidth The width of the container as a percentage or fixed value
 * @returns A sizes attribute string for the Image component
 */
export function getResponsiveSizes(containerWidth: string): string {
  // If container width is a percentage
  if (containerWidth.endsWith("%")) {
    const percentage = Number.parseInt(containerWidth)
    return `(max-width: 768px) 100vw, ${percentage}vw`
  }

  // If container width is fixed
  return containerWidth
}
