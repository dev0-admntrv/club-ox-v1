"use client"

import useSWR, { type SWRConfiguration, type SWRResponse } from "swr"
import { useState } from "react"

// Global fetcher function
const defaultFetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.status}`)
  }
  return response.json()
}

export function useSWRData<T>(
  key: string | null,
  customFetcher?: (url: string) => Promise<T>,
  config?: SWRConfiguration,
): SWRResponse<T, Error> & { isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(true)

  const swr = useSWR<T, Error>(key, customFetcher || defaultFetcher, {
    onSuccess: () => setIsLoading(false),
    onError: () => setIsLoading(false),
    revalidateOnFocus: false,
    ...config,
  })

  return {
    ...swr,
    isLoading,
  }
}

// For mutations
export async function mutateData<T>(url: string, data: any): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Error mutating data: ${response.status}`)
  }

  return response.json()
}
