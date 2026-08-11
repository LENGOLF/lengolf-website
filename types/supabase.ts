export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image: string | null
          meta_title: string | null
          meta_description: string | null
          published_at: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image?: string | null
          meta_title?: string | null
          meta_description?: string | null
          published_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image?: string | null
          meta_title?: string | null
          meta_description?: string | null
          published_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_translations: {
        Row: {
          id: string
          post_id: string
          locale: string
          title: string
          excerpt: string | null
          content: string
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          locale: string
          title: string
          excerpt?: string | null
          content: string
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          locale?: string
          title?: string
          excerpt?: string | null
          content?: string
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_translations_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          }
        ]
      }
      location_pages: {
        Row: {
          id: string
          template_type: string
          location_name: string
          location_slug: string
          url: string
          tier: number | null
          distance_km: number | null
          bts_time_mins: number | null
          taxi_time_mins: number | null
          walking_time_mins: number | null
          taxi_fare_estimate: string | null
          bts_route: string | null
          walking_directions: string | null
          nearby_landmarks: string | null
          nearby_hotels: string | null
          nearby_offices: string | null
          google_maps_embed: string | null
          h1_title: string
          meta_description: string | null
          unique_intro: string | null
          area_pain_point: string | null
          lengolf_pitch: string | null
          other_attractions: string | null
          area_description: string | null
          simulator_specs: string | null
          lesson_packages: string | null
          instructor_info: string | null
          corporate_packages: string | null
          max_capacity: string | null
          catering_options: string | null
          club_rental_info: string | null
          featured_image: string | null
          gallery_images: string | null
          schema_markup: Json | null
          internal_links: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template_type: string
          location_name: string
          location_slug: string
          url: string
          tier?: number | null
          distance_km?: number | null
          bts_time_mins?: number | null
          taxi_time_mins?: number | null
          walking_time_mins?: number | null
          taxi_fare_estimate?: string | null
          bts_route?: string | null
          walking_directions?: string | null
          nearby_landmarks?: string | null
          nearby_hotels?: string | null
          nearby_offices?: string | null
          google_maps_embed?: string | null
          h1_title: string
          meta_description?: string | null
          unique_intro?: string | null
          area_pain_point?: string | null
          lengolf_pitch?: string | null
          other_attractions?: string | null
          area_description?: string | null
          simulator_specs?: string | null
          lesson_packages?: string | null
          instructor_info?: string | null
          corporate_packages?: string | null
          max_capacity?: string | null
          catering_options?: string | null
          club_rental_info?: string | null
          featured_image?: string | null
          gallery_images?: string | null
          schema_markup?: Json | null
          internal_links?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_type?: string
          location_name?: string
          location_slug?: string
          url?: string
          tier?: number | null
          distance_km?: number | null
          bts_time_mins?: number | null
          taxi_time_mins?: number | null
          walking_time_mins?: number | null
          taxi_fare_estimate?: string | null
          bts_route?: string | null
          walking_directions?: string | null
          nearby_landmarks?: string | null
          nearby_hotels?: string | null
          nearby_offices?: string | null
          google_maps_embed?: string | null
          h1_title?: string
          meta_description?: string | null
          unique_intro?: string | null
          area_pain_point?: string | null
          lengolf_pitch?: string | null
          other_attractions?: string | null
          area_description?: string | null
          simulator_specs?: string | null
          lesson_packages?: string | null
          instructor_info?: string | null
          corporate_packages?: string | null
          max_capacity?: string | null
          catering_options?: string | null
          club_rental_info?: string | null
          featured_image?: string | null
          gallery_images?: string | null
          schema_markup?: Json | null
          internal_links?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      club_sets: {
        Row: {
          id: string
          name: string
          brand: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      used_clubs_inventory: {
        Row: {
          id: string
          brand: string
          model: string | null
          club_type: string
          specification: string | null
          shaft: string | null
          gender: string
          condition: string
          price: number
          cost: number | null
          description: string | null
          image_url: string | null
          image_urls: string[]
          purchased_at: string | null
          available_for_sale: boolean
          available_for_rental: boolean
          set_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand: string
          model?: string | null
          club_type: string
          specification?: string | null
          shaft?: string | null
          gender?: string
          condition: string
          price: number
          cost?: number | null
          description?: string | null
          image_url?: string | null
          image_urls?: string[]
          purchased_at?: string | null
          available_for_sale?: boolean
          available_for_rental?: boolean
          set_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string | null
          club_type?: string
          specification?: string | null
          shaft?: string | null
          gender?: string
          condition?: string
          price?: number
          cost?: number | null
          description?: string | null
          image_url?: string | null
          image_urls?: string[]
          purchased_at?: string | null
          available_for_sale?: boolean
          available_for_rental?: boolean
          set_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "used_clubs_inventory_set_id_fkey"
            columns: ["set_id"]
            referencedRelation: "club_sets"
            referencedColumns: ["id"]
          }
        ]
      }
      rental_club_sets: {
        Row: {
          id: string
          name: string
          slug: string
          tier: string
          gender: string
          brand: string | null
          model: string | null
          description: string | null
          specifications: Json | null
          image_url: string | null
          rental_type: string
          indoor_price_1h: number | null
          indoor_price_2h: number | null
          indoor_price_3h: number | null
          indoor_price_4h: number | null
          indoor_price_5h: number | null
          course_price_1d: number | null
          course_price_3d: number | null
          course_price_7d: number | null
          course_price_14d: number | null
          quantity: number
          is_active: boolean
          website_visible: boolean
          display_order: number
          gallery: Json
          variants: Json
          variant_axis: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          tier: string
          gender: string
          brand?: string | null
          model?: string | null
          description?: string | null
          specifications?: Json | null
          image_url?: string | null
          rental_type: string
          indoor_price_1h?: number | null
          indoor_price_2h?: number | null
          indoor_price_3h?: number | null
          indoor_price_4h?: number | null
          indoor_price_5h?: number | null
          course_price_1d?: number | null
          course_price_3d?: number | null
          course_price_7d?: number | null
          course_price_14d?: number | null
          quantity?: number
          is_active?: boolean
          website_visible?: boolean
          display_order?: number
          gallery?: Json
          variants?: Json
          variant_axis?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          tier?: string
          gender?: string
          brand?: string | null
          model?: string | null
          description?: string | null
          specifications?: Json | null
          image_url?: string | null
          rental_type?: string
          indoor_price_1h?: number | null
          indoor_price_2h?: number | null
          indoor_price_3h?: number | null
          indoor_price_4h?: number | null
          indoor_price_5h?: number | null
          course_price_1d?: number | null
          course_price_3d?: number | null
          course_price_7d?: number | null
          course_price_14d?: number | null
          quantity?: number
          is_active?: boolean
          website_visible?: boolean
          display_order?: number
          gallery?: Json
          variants?: Json
          variant_axis?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          message: string
          page_source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          message: string
          page_source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          message?: string
          page_source?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      google_reviews_public: {
        Row: {
          reviewer_name: string
          star_rating: string
          comment: string | null
          language: string | null
          review_created_at: string
        }
        Relationships: []
      }
    }
    Functions: {
      get_google_reviews_stats: {
        Args: Record<string, never>
        Returns: { total_reviews: number; avg_rating: number }[]
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
