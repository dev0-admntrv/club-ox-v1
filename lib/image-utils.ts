/**
 * Utilitários para manipulação de imagens
 */

// Verifica se uma URL é externa (começa com http:// ou https://)
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://")
}

// Verifica se um caminho de imagem é válido
export function isValidImagePath(path: string): boolean {
  if (!path) return false

  // Se for uma URL externa, consideramos válida
  if (isExternalUrl(path)) return true

  // Verifica se o caminho começa com / (caminho absoluto)
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  // Lista de extensões de imagem válidas
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]

  // Verifica se o caminho termina com uma extensão válida
  return validExtensions.some((ext) => normalizedPath.toLowerCase().endsWith(ext))
}

// Obtém uma imagem de fallback com base no tipo de banner
export function getBannerFallbackImage(bannerId: string, title = ""): string {
  const lowerTitle = title.toLowerCase()

  if (bannerId.includes("static-1") || lowerTitle.includes("corte") || lowerTitle.includes("premium")) {
    return "/banners/premium-cuts-banner.jpg"
  } else if (bannerId.includes("static-2") || lowerTitle.includes("vinho") || lowerTitle.includes("degustação")) {
    return "/banners/wine-tasting-event.jpg"
  } else if (lowerTitle.includes("desafio") || lowerTitle.includes("challenge")) {
    return "/banners/challenge-banner.jpg"
  } else {
    return "/banners/loyalty-rewards-banner.jpg"
  }
}
