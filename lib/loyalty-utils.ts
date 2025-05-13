// Mapping loyalty levels to their respective colors
export const getLoyaltyColor = (level: string | null | undefined): string => {
  if (!level) return "text-primary" // Default color if no level

  const normalizedLevel = level.toLowerCase()

  if (normalizedLevel.includes("bronze")) return "text-amber-600"
  if (normalizedLevel.includes("prata")) return "text-slate-400"
  if (normalizedLevel.includes("ouro")) return "text-yellow-500"
  if (normalizedLevel.includes("diamante")) return "text-cyan-400"
  if (normalizedLevel.includes("mestre")) return "text-rose-600"

  // Default fallback
  return "text-primary"
}

// Get background color for loyalty level (for badges, icons, etc.)
export const getLoyaltyBgColor = (level: string | null | undefined): string => {
  if (!level) return "bg-primary/10" // Default color if no level

  const normalizedLevel = level.toLowerCase()

  if (normalizedLevel.includes("bronze")) return "bg-amber-600/10"
  if (normalizedLevel.includes("prata")) return "bg-slate-400/10"
  if (normalizedLevel.includes("ouro")) return "bg-yellow-500/10"
  if (normalizedLevel.includes("diamante")) return "bg-cyan-400/10"
  if (normalizedLevel.includes("mestre")) return "bg-rose-600/10"

  // Default fallback
  return "bg-primary/10"
}

// Get gradient colors for loyalty level
export const getLoyaltyGradient = (level: string | null | undefined): string => {
  if (!level) return "from-primary to-primary-foreground" // Default color if no level

  const normalizedLevel = level.toLowerCase()

  if (normalizedLevel.includes("bronze")) return "from-amber-600 to-amber-800"
  if (normalizedLevel.includes("prata")) return "from-slate-400 to-slate-600"
  if (normalizedLevel.includes("ouro")) return "from-yellow-500 to-amber-600"
  if (normalizedLevel.includes("diamante")) return "from-cyan-400 to-blue-600"
  if (normalizedLevel.includes("mestre")) return "from-rose-600 to-red-700"

  // Default fallback
  return "from-primary to-primary-foreground"
}
