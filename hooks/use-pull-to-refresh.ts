"use client"

import { useState, useCallback } from "react"

export function usePullToRefresh<T>(fetchFn: () => Promise<T>, initialData?: T) {
  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const newData = await fetchFn()
      setData(newData)
      return newData
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Erro ao atualizar dados")
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn])

  const handlePullToRefresh = useCallback(async () => {
    try {
      await refresh()
    } catch (error) {
      console.error("Erro ao atualizar:", error)
    }
  }, [refresh])

  return {
    data,
    isLoading,
    error,
    refresh,
    handlePullToRefresh,
  }
}
