"use client"

import { useAuth } from "@/contexts/auth-context"
import { useSWRData } from "./use-swr"
import type { UserBadge, PointsTransaction, Challenge, LoyaltyLevel } from "@/lib/types"

export function useUserData() {
  const { user } = useAuth()

  const {
    data: userBadges,
    error: badgesError,
    isLoading: badgesLoading,
    mutate: mutateBadges,
  } = useSWRData<UserBadge[]>(user ? `/api/users/${user.id}/badges` : null)

  const {
    data: transactions,
    error: transactionsError,
    isLoading: transactionsLoading,
    mutate: mutateTransactions,
  } = useSWRData<PointsTransaction[]>(user ? `/api/users/${user.id}/transactions` : null)

  const {
    data: activeChallenges,
    error: challengesError,
    isLoading: challengesLoading,
    mutate: mutateChallenges,
  } = useSWRData<Challenge[]>(user ? `/api/users/${user.id}/challenges/active` : null)

  const {
    data: nextLevel,
    error: nextLevelError,
    isLoading: nextLevelLoading,
  } = useSWRData<LoyaltyLevel | null>(
    user?.loyalty_level_id ? `/api/loyalty-levels/next/${user.loyalty_level_id}` : null,
  )

  const isLoading = {
    badges: badgesLoading,
    transactions: transactionsLoading,
    challenges: challengesLoading,
    nextLevel: nextLevelLoading,
  }

  const errors = {
    badges: badgesError,
    transactions: transactionsError,
    challenges: challengesError,
    nextLevel: nextLevelError,
  }

  return {
    userBadges: userBadges || [],
    transactions: transactions || [],
    activeChallenges: activeChallenges || [],
    nextLevel,
    isLoading,
    errors,
    mutate: {
      badges: mutateBadges,
      transactions: mutateTransactions,
      challenges: mutateChallenges,
    },
  }
}
