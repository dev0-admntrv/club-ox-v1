import { cn } from "@/lib/utils"

interface ImagePlaceholderProps {
  className?: string
  width?: number
  height?: number
  text?: string
}

export function ImagePlaceholder({ className, width = 300, height = 200, text = "Imagem" }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground rounded-md overflow-hidden",
        className,
      )}
      style={{ width, height }}
    >
      <div className="text-center p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto h-8 w-8 mb-2 opacity-50"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <p className="text-xs">{text}</p>
      </div>
    </div>
  )
}
