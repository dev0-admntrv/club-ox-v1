export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      loyalty_levels: {
        Row: {
          id: string
          name: string
          min_points_required: number
          description: string | null
          discount_percentage: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          min_points_required: number
          description?: string | null
          discount_percentage?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          min_points_required?: number
          description?: string | null
          discount_percentage?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          phone_number: string | null
          cpf: string | null
          birth_date: string | null
          loyalty_level_id: string | null
          points_balance: number | null
          role: string
          cod_cliente_lexsis: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          phone_number?: string | null
          cpf?: string | null
          birth_date?: string | null
          loyalty_level_id?: string | null
          points_balance?: number | null
          role?: string
          cod_cliente_lexsis?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone_number?: string | null
          cpf?: string | null
          birth_date?: string | null
          loyalty_level_id?: string | null
          points_balance?: number | null
          role?: string
          cod_cliente_lexsis?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      points_transactions: {
        Row: {
          id: string
          user_id: string
          points_change: number
          transaction_type: string
          related_order_id: string | null
          related_user_challenge_id: string | null
          related_visit_id: string | null
          description: string | null
          transaction_date: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          points_change: number
          transaction_type: string
          related_order_id?: string | null
          related_user_challenge_id?: string | null
          related_visit_id?: string | null
          description?: string | null
          transaction_date: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          points_change?: number
          transaction_type?: string
          related_order_id?: string | null
          related_user_challenge_id?: string | null
          related_visit_id?: string | null
          description?: string | null
          transaction_date?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      challenges: {
        Row: {
          id: string
          name: string
          description: string | null
          points_reward: number
          is_active: boolean | null
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          points_reward: number
          is_active?: boolean | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          points_reward?: number
          is_active?: boolean | null
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      user_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          status: string | null
          progress_details: Json | null
          completed_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          status?: string | null
          progress_details?: Json | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          status?: string | null
          progress_details?: Json | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
      }
      product_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      products: {
        Row: {
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
          is_active: boolean | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price?: number | null
          points_cost?: number | null
          category_id?: string | null
          image_url?: string | null
          stock_quantity?: number | null
          type: string
          min_loyalty_level_id_to_view?: string | null
          min_loyalty_level_id_to_purchase?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number | null
          points_cost?: number | null
          category_id?: string | null
          image_url?: string | null
          stock_quantity?: number | null
          type?: string
          min_loyalty_level_id_to_view?: string | null
          min_loyalty_level_id_to_purchase?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_date: string
          total_amount: number | null
          total_points_spent: number | null
          status: string
          order_type: string
          external_order_ref: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          order_date: string
          total_amount?: number | null
          total_points_spent?: number | null
          status: string
          order_type: string
          external_order_ref?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          order_date?: string
          total_amount?: number | null
          total_points_spent?: number | null
          status?: string
          order_type?: string
          external_order_ref?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number | null
          unit_points_cost: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price?: number | null
          unit_points_cost?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number | null
          unit_points_cost?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      visitas: {
        Row: {
          id: string
          cod_cliente_lexsis: string
          visit_date: string
          total_value: number | null
          item_code: string
          item_description: string | null
          points_earned: number | null
          processed_for_loyalty: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          cod_cliente_lexsis: string
          visit_date: string
          total_value?: number | null
          item_code: string
          item_description?: string | null
          points_earned?: number | null
          processed_for_loyalty?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          cod_cliente_lexsis?: string
          visit_date?: string
          total_value?: number | null
          item_code?: string
          item_description?: string | null
          points_earned?: number | null
          processed_for_loyalty?: boolean | null
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          reservation_type: string
          reservation_datetime: string
          number_of_guests: number | null
          product_id: string | null
          quantity: number | null
          status: string | null
          special_requests: string | null
          dry_aged_preferences: Json | null
          welcome_drink_applied: boolean | null
          loyalty_level_at_reservation_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          reservation_type: string
          reservation_datetime: string
          number_of_guests?: number | null
          product_id?: string | null
          quantity?: number | null
          status?: string | null
          special_requests?: string | null
          dry_aged_preferences?: Json | null
          welcome_drink_applied?: boolean | null
          loyalty_level_at_reservation_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          reservation_type?: string
          reservation_datetime?: string
          number_of_guests?: number | null
          product_id?: string | null
          quantity?: number | null
          status?: string | null
          special_requests?: string | null
          dry_aged_preferences?: Json | null
          welcome_drink_applied?: boolean | null
          loyalty_level_at_reservation_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      exclusive_experiences: {
        Row: {
          id: string
          name: string
          description: string | null
          experience_datetime: string
          location: string | null
          min_loyalty_level_id_required: string | null
          points_cost: number | null
          capacity: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          experience_datetime: string
          location?: string | null
          min_loyalty_level_id_required?: string | null
          points_cost?: number | null
          capacity?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          experience_datetime?: string
          location?: string | null
          min_loyalty_level_id_required?: string | null
          points_cost?: number | null
          capacity?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
      }
      user_experience_registrations: {
        Row: {
          id: string
          user_id: string
          experience_id: string
          registration_date: string
          status: string | null
        }
        Insert: {
          id?: string
          user_id: string
          experience_id: string
          registration_date: string
          status?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          experience_id?: string
          registration_date?: string
          status?: string | null
        }
      }
      banners: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          cta_link: string | null
          target_min_loyalty_level_id: string | null
          is_active: boolean | null
          start_date: string | null
          end_date: string | null
          display_order: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          cta_link?: string | null
          target_min_loyalty_level_id?: string | null
          is_active?: boolean | null
          start_date?: string | null
          end_date?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          cta_link?: string | null
          target_min_loyalty_level_id?: string | null
          is_active?: boolean | null
          start_date?: string | null
          end_date?: string | null
          display_order?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          subject: string | null
          message: string
          submitted_at: string
          status: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          subject?: string | null
          message: string
          submitted_at: string
          status?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string | null
          message?: string
          submitted_at?: string
          status?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      app_notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string | null
          cta_link: string | null
          read_status: boolean | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string | null
          cta_link?: string | null
          read_status?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string | null
          cta_link?: string | null
          read_status?: boolean | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
