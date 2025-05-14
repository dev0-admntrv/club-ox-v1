"use client"

import { getSupabaseClient } from "@/lib/supabase/client"
import type { Challenge, UserChallenge } from "@/lib/types"

export const challengeService = {
  async getActiveChallenges(userId: string): Promise<Challenge[]> {
    const supabase = getSupabaseClient()

    try {
      const { data, error } = await supabase
        .from("challenges")
        .select(`
          id,
          name,
          description,
          points_reward,
          is_active,
          start_date,
          end_date,
          created_at,
          updated_at,
          user_challenges:user_challenges!inner(
            id,
            status,
            progress_details,
            created_at,
            updated_at,
            completed_at
          )
        `)
        .eq("is_active", true)
        .eq("user_challenges.user_id", userId)
        .eq("user_challenges.status", "in_progress")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching active challenges:", error)
        throw error
      }

      return data as unknown as Challenge[]
    } catch (error) {
      console.error("Error in getActiveChallenges:", error)
      // Return empty array instead of throwing to prevent UI from breaking
      return []
    }
  },

  async getAvailableChallenges(userId: string): Promise<Challenge[]> {
    const supabase = getSupabaseClient()

    try {
      // First, get all active challenges
      const { data: allChallenges, error: allChallengesError } = await supabase
        .from("challenges")
        .select(`
          id,
          name,
          description,
          points_reward,
          is_active,
          start_date,
          end_date,
          created_at,
          updated_at
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (allChallengesError) {
        console.error("Error fetching all challenges:", allChallengesError)
        throw allChallengesError
      }

      // Then, get all challenges that the user has already started
      const { data: userChallenges, error: userChallengesError } = await supabase
        .from("user_challenges")
        .select("challenge_id")
        .eq("user_id", userId)

      if (userChallengesError) {
        console.error("Error fetching user challenges:", userChallengesError)
        throw userChallengesError
      }

      // Create a set of challenge IDs that the user has already started
      const userChallengeIds = new Set(userChallenges.map((uc) => uc.challenge_id))

      // Filter out challenges that the user has already started
      const availableChallenges = allChallenges.filter((challenge) => !userChallengeIds.has(challenge.id))

      return availableChallenges
    } catch (error) {
      console.error("Error in getAvailableChallenges:", error)
      return []
    }
  },

  async getCompletedChallenges(userId: string): Promise<Challenge[]> {
    const supabase = getSupabaseClient()

    try {
      // First, get the user challenges that are completed
      const { data: userChallenges, error: userChallengesError } = await supabase
        .from("user_challenges")
        .select("*, challenge:challenge_id(*)")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })

      if (userChallengesError) {
        console.error("Error fetching completed user challenges:", userChallengesError)
        throw userChallengesError
      }

      // Transform the data to match the expected Challenge format
      const completedChallenges = userChallenges.map((uc) => {
        const challenge = uc.challenge
        return {
          ...challenge,
          user_challenges: [
            {
              id: uc.id,
              status: uc.status,
              progress_details: uc.progress_details,
              created_at: uc.created_at,
              updated_at: uc.updated_at,
              completed_at: uc.completed_at,
            },
          ],
        }
      })

      return completedChallenges as unknown as Challenge[]
    } catch (error) {
      console.error("Error in getCompletedChallenges:", error)
      return []
    }
  },

  async startChallenge(userId: string, challengeId: string): Promise<UserChallenge> {
    const supabase = getSupabaseClient()

    try {
      // Check if the user has already started this challenge
      const { data: existingChallenge, error: checkError } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", userId)
        .eq("challenge_id", challengeId)
        .maybeSingle()

      if (checkError) {
        console.error("Error checking existing challenge:", checkError)
        throw checkError
      }

      if (existingChallenge) {
        console.log("User has already started this challenge:", existingChallenge)
        return existingChallenge as UserChallenge
      }

      // Get challenge details to set up initial progress correctly
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challengeId)
        .single()

      if (challengeError) {
        console.error("Error fetching challenge details:", challengeError)
        throw challengeError
      }

      // Set a default total value for progress
      const total = 1

      // Insert the new user challenge
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from("user_challenges")
        .insert({
          user_id: userId,
          challenge_id: challengeId,
          status: "in_progress",
          progress_details: { progress: 0, total: total },
          created_at: now,
          updated_at: now,
        })
        .select()

      if (error) {
        console.error("Error starting challenge:", error)
        throw error
      }

      return data[0] as UserChallenge
    } catch (error) {
      console.error("Error in startChallenge:", error)
      throw error
    }
  },

  async updateChallengeProgress(userChallengeId: string, progressDetails: any): Promise<UserChallenge> {
    const supabase = getSupabaseClient()

    try {
      const { data, error } = await supabase
        .from("user_challenges")
        .update({
          progress_details: progressDetails,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userChallengeId)
        .select()

      if (error) {
        console.error("Error updating challenge progress:", error)
        throw error
      }

      return data[0] as UserChallenge
    } catch (error) {
      console.error("Error in updateChallengeProgress:", error)
      throw error
    }
  },

  async completeChallenge(
    userChallengeId: string,
    userId: string,
    pointsReward: number,
  ): Promise<{
    challenge: UserChallenge
    transaction: any
    newPointsBalance: number
  }> {
    const supabase = getSupabaseClient()

    try {
      // Get user challenge details to check if it's already completed
      const { data: userChallengeData, error: userChallengeError } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("id", userChallengeId)
        .single()

      if (userChallengeError) {
        console.error("Error fetching user challenge:", userChallengeError)
        throw userChallengeError
      }

      if (userChallengeData.status === "completed") {
        console.log("Challenge already completed:", userChallengeData)
        return {
          challenge: userChallengeData as UserChallenge,
          transaction: null,
          newPointsBalance: 0, // We'll fetch the current balance below
        }
      }

      // 1. Update the challenge status
      const now = new Date().toISOString()
      const { data: challengeData, error: challengeError } = await supabase
        .from("user_challenges")
        .update({
          status: "completed",
          completed_at: now,
          updated_at: now,
        })
        .eq("id", userChallengeId)
        .select()

      if (challengeError) {
        console.error("Error completing challenge:", challengeError)
        throw challengeError
      }

      // 2. Add points transaction
      const { data: transactionData, error: transactionError } = await supabase
        .from("points_transactions")
        .insert({
          user_id: userId,
          points_change: pointsReward,
          transaction_type: "CHALLENGE_COMPLETION",
          related_user_challenge_id: userChallengeId,
          description: `Conclusão de desafio: ${challengeData[0].challenge_id}`,
          transaction_date: now,
          created_at: now,
        })
        .select()

      if (transactionError) {
        console.error("Error creating points transaction:", transactionError)
        throw transactionError
      }

      // 3. Update user's points balance
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("points_balance")
        .eq("id", userId)
        .single()

      if (userError) {
        console.error("Error fetching user points balance:", userError)
        throw userError
      }

      const newBalance = (userData.points_balance || 0) + pointsReward

      const { error: updateError } = await supabase
        .from("users")
        .update({
          points_balance: newBalance,
          updated_at: now,
        })
        .eq("id", userId)

      if (updateError) {
        console.error("Error updating user points balance:", updateError)
        throw updateError
      }

      // 4. Check if there's a badge associated with this challenge and award it
      const { data: challengeDetails, error: detailsError } = await supabase
        .from("challenges")
        .select("badge_id")
        .eq("id", challengeData[0].challenge_id)
        .single()

      if (detailsError) {
        console.error("Error fetching challenge details for badge:", detailsError)
      } else if (challengeDetails.badge_id) {
        // Award the badge to the user
        const { error: badgeError } = await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: challengeDetails.badge_id,
          earned_at: now,
        })

        if (badgeError) {
          console.error("Error awarding badge to user:", badgeError)
        }
      }

      return {
        challenge: challengeData[0] as UserChallenge,
        transaction: transactionData[0],
        newPointsBalance: newBalance,
      }
    } catch (error) {
      console.error("Error in completeChallenge:", error)
      throw error
    }
  },

  // Method to check and update challenge progress automatically
  async checkAndUpdateChallenges(userId: string): Promise<void> {
    const supabase = getSupabaseClient()

    try {
      // Get active user challenges
      const { data: activeChallenges, error: challengesError } = await supabase
        .from("user_challenges")
        .select(`
          id,
          challenge_id,
          status,
          progress_details,
          created_at,
          updated_at,
          challenges:challenge_id(
            id,
            name,
            description,
            points_reward
          )
        `)
        .eq("user_id", userId)
        .eq("status", "in_progress")

      if (challengesError) {
        console.error("Error checking active challenges:", challengesError)
        return
      }

      if (!activeChallenges || activeChallenges.length === 0) return

      // For each active challenge, check and update progress
      for (const userChallenge of activeChallenges) {
        // Simplified progress update - just increment by 1 for demo purposes
        const currentProgress = userChallenge.progress_details || { progress: 0, total: 1 }
        const newProgress = {
          ...currentProgress,
          progress: Math.min(currentProgress.progress + 1, currentProgress.total),
        }

        // Update progress if there's a change
        if (newProgress.progress !== currentProgress.progress) {
          await this.updateChallengeProgress(userChallenge.id, newProgress)

          // Check if challenge is completed
          if (newProgress.progress >= newProgress.total) {
            await this.completeChallenge(userChallenge.id, userId, userChallenge.challenges.points_reward)
          }
        }
      }
    } catch (error) {
      console.error("Error in checkAndUpdateChallenges:", error)
    }
  },

  // Method to listen for real-time changes to user challenges
  subscribeToUserChallenges(userId: string, callback: (payload: any) => void): () => void {
    const supabase = getSupabaseClient()

    const subscription = supabase
      .channel("user-challenges-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_challenges",
          filter: `user_id=eq.${userId}`,
        },
        callback,
      )
      .subscribe()

    // Return function to unsubscribe
    return () => {
      subscription.unsubscribe()
    }
  },

  // Get badge details for a challenge
  async getBadgeForChallenge(challengeId: string): Promise<any> {
    const supabase = getSupabaseClient()

    try {
      const { data: challenge, error: challengeError } = await supabase
        .from("challenges")
        .select("badge_id")
        .eq("id", challengeId)
        .single()

      if (challengeError) {
        console.error("Error fetching challenge badge ID:", challengeError)
        return null
      }

      if (!challenge.badge_id) return null

      const { data: badge, error: badgeError } = await supabase
        .from("badges")
        .select("*")
        .eq("id", challenge.badge_id)
        .single()

      if (badgeError) {
        console.error("Error fetching badge details:", badgeError)
        return null
      }

      return badge
    } catch (error) {
      console.error("Error in getBadgeForChallenge:", error)
      return null
    }
  },
}
