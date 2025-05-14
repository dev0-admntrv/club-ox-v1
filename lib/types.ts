export interface User {
  id: string
  name: string | null
  email: string
  phone_number: string | null
  cpf: string | null
  birth_date: string | null
  loyalty_level_id: string | null
  points_balance: number
  role: string
  cod_cliente_lexsis: string | null
  created_at: string
  updated_at: string | null
  loyalty_level?: LoyaltyLevel
}

export interface LoyaltyLevel {
  id: string
  name: string
  min_points_required: number
  description: string | null
  discount_percentage: number | null
}

export interface Challenge {
  id: string
  name: string
  description: string
  points_reward: number
  type: "visit" | "consumption" | "referral" | "special"
  badge_id?: string
  badge_name?: string
  is_active: boolean
  start_date?: string
  end_date?: string
  created_at: string
  updated_at?: string
  user_challenge?: UserChallenge
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  status: "available" | "in_progress" | "completed" | "expired"
  progress_details: {
    progress: number
    total: number
  }
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface Badge {
  id: string
  name: string
  description?: string
  image_url?: string
  created_at: string
  updated_at?: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number | null
  points_cost: number | null
  category_id: string | null
  image_url: string | null
  stock_quantity: number | null
  type: string
  min_loyalty_level_id_to_view: string | null
  min_loyalty_level_id_to_purchase: string | null
  is_active: boolean
  category?: ProductCategory
}

export interface ProductCategory {
  id: string
  name: string
  description: string | null
}

export interface PointsTransaction {
  id: string
  user_id: string
  points_change: number
  transaction_type: string
  description: string | null
  transaction_date: string
}

export interface Visit {
  id: string
  cod_cliente_lexsis: string
  visit_date: string
  total_value: number | null
  item_code: string
  item_description: string | null
  points_earned: number | null
}

export interface Banner {
  id: string
  title: string
  description: string | null
  image_url: string
  cta_link: string | null
  is_active: boolean
  display_order: number | null
}

export interface Reservation {
  id: string
  user_id: string
  reservation_type: "table" | "dry_aged" | "experience"
  reservation_datetime: string
  number_of_guests: number | null
  product_id: string | null
  product?: Product
  quantity: number | null
  status: "pending" | "confirmed" | "cancelled" | "completed"
  special_requests: string | null
  dry_aged_preferences: {
    cut_type?: string
    maturation_days?: number
    preparation?: string
    notes?: string
  } | null
  welcome_drink_applied: boolean | null
  loyalty_level_at_reservation_id: string | null
  created_at: string
  updated_at: string | null
}

export interface ExclusiveExperience {
  id: string
  name: string
  description: string | null
  experience_datetime: string
  location: string | null
  min_loyalty_level_id_required: string | null
  points_cost: number | null
  capacity: number | null
  is_active: boolean
  image_url?: string | null
  created_at: string
  updated_at: string | null
}

export interface UserExperienceRegistration {
  id: string
  user_id: string
  experience_id: string
  registration_date: string
  status: "pending" | "confirmed" | "cancelled"
  number_of_guests: number | null
}
