export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          room_code: string
          user_id: string
          username: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          room_code: string
          user_id: string
          username: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          room_code?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_code_fkey"
            columns: ["room_code"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["code"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          code: string
          created_at: string
          creator_id: string
          name: string | null
        }
        Insert: {
          code: string
          created_at?: string
          creator_id: string
          name?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          creator_id?: string
          name?: string | null
        }
        Relationships: []
      }
      daily_attempts: {
        Row: {
          attempt_date: string
          completed: boolean
          created_at: string
          score: number
          user_id: string
        }
        Insert: {
          attempt_date: string
          completed?: boolean
          created_at?: string
          score?: number
          user_id: string
        }
        Update: {
          attempt_date?: string
          completed?: boolean
          created_at?: string
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      daily_questions: {
        Row: {
          choices: string[]
          correct_index: number
          created_at: string
          id: string
          occupation: string
          order_index: number
          question: string
          question_date: string
        }
        Insert: {
          choices: string[]
          correct_index: number
          created_at?: string
          id?: string
          occupation: string
          order_index: number
          question: string
          question_date: string
        }
        Update: {
          choices?: string[]
          correct_index?: number
          created_at?: string
          id?: string
          occupation?: string
          order_index?: number
          question?: string
          question_date?: string
        }
        Relationships: []
      }
      daily_scores: {
        Row: {
          created_at: string
          id: string
          occupation: string
          score: number
          score_date: string
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          occupation: string
          score: number
          score_date: string
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          occupation?: string
          score?: number
          score_date?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          article_date: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          published_at: string | null
          source: string | null
          title: string
          topic: string
          url: string | null
        }
        Insert: {
          article_date: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          source?: string | null
          title: string
          topic: string
          url?: string | null
        }
        Update: {
          article_date?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          source?: string | null
          title?: string
          topic?: string
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active_font: string
          active_wallpaper: string
          created_at: string
          id: string
          interests: string[]
          occupation: string | null
          onboarded: boolean
          updated_at: string
          username: string
          wallet_points: number
          weekly_points: number
        }
        Insert: {
          active_font?: string
          active_wallpaper?: string
          created_at?: string
          id: string
          interests?: string[]
          occupation?: string | null
          onboarded?: boolean
          updated_at?: string
          username: string
          wallet_points?: number
          weekly_points?: number
        }
        Update: {
          active_font?: string
          active_wallpaper?: string
          created_at?: string
          id?: string
          interests?: string[]
          occupation?: string | null
          onboarded?: boolean
          updated_at?: string
          username?: string
          wallet_points?: number
          weekly_points?: number
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          asset_key: string
          cost: number
          created_at: string
          description: string | null
          id: string
          kind: string
          name: string
        }
        Insert: {
          asset_key: string
          cost: number
          created_at?: string
          description?: string | null
          id?: string
          kind: string
          name: string
        }
        Update: {
          asset_key?: string
          cost?: number
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          name?: string
        }
        Relationships: []
      }
      user_inventory: {
        Row: {
          acquired_at: string
          item_id: string
          user_id: string
        }
        Insert: {
          acquired_at?: string
          item_id: string
          user_id: string
        }
        Update: {
          acquired_at?: string
          item_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_awards: {
        Row: {
          created_at: string
          id: string
          occupation: string
          points_awarded: number
          rank: number
          user_id: string
          week_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          occupation: string
          points_awarded: number
          rank: number
          user_id: string
          week_start: string
        }
        Update: {
          created_at?: string
          id?: string
          occupation?: string
          points_awarded?: number
          rank?: number
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      spotify_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          refresh_token: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          refresh_token: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          refresh_token?: string
          user_id?: string
        }
        Relationships: []
      }
      spotify_playlists: {
        Row: {
          description: string | null
          id: string
          image_url: string | null
          name: string
          spotify_url: string
          synced_at: string
          track_count: number
          user_id: string
        }
        Insert: {
          description?: string | null
          id: string
          image_url?: string | null
          name: string
          spotify_url: string
          synced_at?: string
          track_count?: number
          user_id: string
        }
        Update: {
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          spotify_url?: string
          synced_at?: string
          track_count?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      leaderboard_for: {
        Args: { occ: string; week: string }
        Returns: {
          rank: number
          total_score: number
          user_id: string
          username: string
        }[]
      }
      purchase_item:
        | {
            Args: { item: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.purchase_item(item => text), public.purchase_item(item => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"[]
          }
        | {
            Args: { item: string }
            Returns: {
              error: true
            } & "Could not choose the best candidate function between: public.purchase_item(item => text), public.purchase_item(item => uuid). Try renaming the parameters or the function itself in the database so function overloading can be resolved"
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
