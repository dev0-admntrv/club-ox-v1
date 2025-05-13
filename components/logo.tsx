import Link from "next/link"
import { cn } from "@/lib/utils"
import { ResponsiveImage } from "@/components/ui/responsive-image"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/home" className={cn("inline-block", className)}>
      <div className="flex items-center gap-2">
        <div className="w-20 h-10 relative">
          <ResponsiveImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1-e1718106048155%20%281%29-INfZzptdk096qVsjKkK50rH26MTwbe.png"
            alt="OX Steakhouse"
            width={80}
            height={40}
            className="h-auto"
            sizes="80px"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight">CLUB OX</span>
          <span className="text-xs text-muted-foreground">Premium</span>
        </div>
      </div>
    </Link>
  )
}
