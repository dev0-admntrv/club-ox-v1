import { Skeleton } from "@/components/ui/skeleton"

export default function SelfServiceLoading() {
  return (
    <div className="flex flex-col w-full h-screen">
      <header className="bg-background border-b border-border/50 p-4 flex items-center justify-center">
        <h1 className="text-xl font-bold text-center">Menu Digital</h1>
      </header>

      <div className="flex-1 p-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
