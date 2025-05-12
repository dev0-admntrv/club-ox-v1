import Image from "next/image"
import Link from "next/link"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/home" className={`inline-block ${className}`}>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1-e1718106048155%20%281%29-INfZzptdk096qVsjKkK50rH26MTwbe.png"
        alt="OX Steakhouse"
        width={80}
        height={40}
        className="h-auto"
      />
    </Link>
  )
}
