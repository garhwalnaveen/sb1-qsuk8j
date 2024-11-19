export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string
          full_name: string
          avatar_url: string
          website: string
          role: 'admin' | 'member'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username: string
          full_name?: string
          avatar_url?: string
          website?: string
          role?: 'admin' | 'member'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string
          full_name?: string
          avatar_url?: string
          website?: string
          role?: 'admin' | 'member'
        }
      }
      social_accounts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
          access_token: string
          refresh_token: string
          expires_at: string
          platform_user_id: string
          platform_username: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
          access_token: string
          refresh_token: string
          expires_at: string
          platform_user_id: string
          platform_username: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
          access_token?: string
          refresh_token?: string
          expires_at?: string
          platform_user_id?: string
          platform_username?: string
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          content: string
          media_urls: string[]
          scheduled_for: string
          published_at: string | null
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          platforms: ('twitter' | 'facebook' | 'instagram' | 'linkedin')[]
          platform_post_ids: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          content: string
          media_urls?: string[]
          scheduled_for: string
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          platforms: ('twitter' | 'facebook' | 'instagram' | 'linkedin')[]
          platform_post_ids?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          content?: string
          media_urls?: string[]
          scheduled_for?: string
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          platforms?: ('twitter' | 'facebook' | 'instagram' | 'linkedin')[]
          platform_post_ids?: Json
        }
      }
      analytics: {
        Row: {
          id: string
          created_at: string
          post_id: string
          platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
          likes: number
          shares: number
          comments: number
          impressions: number
          reach: number
        }
        Insert: {
          id?: string
          created_at?: string
          post_id: string
          platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
          likes: number
          shares: number
          comments: number
          impressions: number
          reach: number
        }
        Update: {
          id?: string
          created_at?: string
          post_id?: string
          platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
          likes?: number
          shares?: number
          comments?: number
          impressions?: number
          reach?: number
        }
      }
    }
    Views: {
      post_analytics: {
        Row: {
          post_id: string
          total_likes: number
          total_shares: number
          total_comments: number
          total_impressions: number
          total_reach: number
          platform_breakdown: Json
        }
      }
    }
    Functions: {
      get_user_analytics: {
        Args: {
          user_id: string
          start_date: string
          end_date: string
        }
        Returns: Json
      }
    }
  }
}