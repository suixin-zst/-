/**
 * 数据库契约（与 supabase/schema.sql 一一镜像）
 *
 * 冻结规则：schema 变更只能「只加不改」，且由地基执笔人同步修改
 * 本文件与 schema.sql。两个 AI 会话都以这里的类型为准。
 */

// ========== 枚举 ==========

export type Role = "host" | "merchant";
export type WorkType = "video" | "image" | "audio";
export type GigType = "年会" | "发布会" | "路演" | "展会" | "婚礼" | "直播" | "其他";
export type GigStatus = "open" | "matched" | "closed";
export type ApplicationInitiator = "host" | "merchant";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

// ========== Supabase Database 泛型 ==========

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; role: Role; name: string; avatar_url: string | null; created_at: string };
        Insert: { id?: string; role: Role; name?: string; avatar_url?: string | null; created_at?: string };
        Update: { id?: string; role?: Role; name?: string; avatar_url?: string | null; created_at?: string };
        Relationships: [];
      };
      host_profiles: {
        Row: {
          user_id: string; city: string | null; gender: string | null; styles: string[];
          bio: string | null; price_hourly: number | null; price_half_day: number | null;
          price_full_day: number | null; experience_years: number | null; is_verified: boolean;
          rating: number; rating_count: number;
        };
        Insert: {
          user_id: string; city?: string | null; gender?: string | null; styles?: string[];
          bio?: string | null; price_hourly?: number | null; price_half_day?: number | null;
          price_full_day?: number | null; experience_years?: number | null; is_verified?: boolean;
          rating?: number; rating_count?: number;
        };
        Update: {
          user_id?: string; city?: string | null; gender?: string | null; styles?: string[];
          bio?: string | null; price_hourly?: number | null; price_half_day?: number | null;
          price_full_day?: number | null; experience_years?: number | null; is_verified?: boolean;
          rating?: number; rating_count?: number;
        };
        Relationships: [];
      };
      merchant_profiles: {
        Row: { user_id: string; company: string | null; industry: string | null; intro: string | null; is_verified: boolean };
        Insert: { user_id: string; company?: string | null; industry?: string | null; intro?: string | null; is_verified?: boolean };
        Update: { user_id?: string; company?: string | null; industry?: string | null; intro?: string | null; is_verified?: boolean };
        Relationships: [];
      };
      works: {
        Row: { id: string; host_id: string; type: WorkType; url: string; title: string | null; sort: number; created_at: string };
        Insert: { id?: string; host_id: string; type: WorkType; url: string; title?: string | null; sort?: number; created_at?: string };
        Update: { id?: string; host_id?: string; type?: WorkType; url?: string; title?: string | null; sort?: number; created_at?: string };
        Relationships: [];
      };
      gigs: {
        Row: {
          id: string; merchant_id: string; title: string; type: GigType; city: string;
          event_date: string; duration: string; budget_min: number | null; budget_max: number | null;
          requirements: string | null; description: string | null; status: GigStatus; created_at: string;
        };
        Insert: {
          id?: string; merchant_id: string; title: string; type: GigType; city: string;
          event_date: string; duration: string; budget_min?: number | null; budget_max?: number | null;
          requirements?: string | null; description?: string | null; status?: GigStatus; created_at?: string;
        };
        Update: {
          id?: string; merchant_id?: string; title?: string; type?: GigType; city?: string;
          event_date?: string; duration?: string; budget_min?: number | null; budget_max?: number | null;
          requirements?: string | null; description?: string | null; status?: GigStatus; created_at?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: { id: string; gig_id: string; host_id: string; initiator: ApplicationInitiator; status: ApplicationStatus; message: string | null; created_at: string };
        Insert: { id?: string; gig_id: string; host_id: string; initiator: ApplicationInitiator; status?: ApplicationStatus; message?: string | null; created_at?: string };
        Update: { id?: string; gig_id?: string; host_id?: string; initiator?: ApplicationInitiator; status?: ApplicationStatus; message?: string | null; created_at?: string };
        Relationships: [];
      };
      conversations: {
        Row: { id: string; gig_id: string | null; host_id: string; merchant_id: string; created_at: string };
        Insert: { id?: string; gig_id?: string | null; host_id: string; merchant_id: string; created_at?: string };
        Update: { id?: string; gig_id?: string | null; host_id?: string; merchant_id?: string; created_at?: string };
        Relationships: [];
      };
      messages: {
        Row: { id: string; conversation_id: string; sender_id: string; content: string; created_at: string };
        Insert: { id?: string; conversation_id: string; sender_id: string; content: string; created_at?: string };
        Update: { id?: string; conversation_id?: string; sender_id?: string; content?: string; created_at?: string };
        Relationships: [];
      };
      reviews: {
        Row: { id: string; gig_id: string; reviewer_id: string; reviewee_id: string; rating: number; content: string | null; created_at: string };
        Insert: { id?: string; gig_id: string; reviewer_id: string; reviewee_id: string; rating: number; content?: string | null; created_at?: string };
        Update: { id?: string; gig_id?: string; reviewer_id?: string; reviewee_id?: string; rating?: number; content?: string | null; created_at?: string };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      user_role: Role;
      work_type: WorkType;
      gig_type: GigType;
      gig_status: GigStatus;
      application_initiator: ApplicationInitiator;
      application_status: ApplicationStatus;
    };
  };
}

// ========== 便捷行类型（页面里 import 这些，不要手写 interface 重复契约） ==========

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type HostProfileRow = Database["public"]["Tables"]["host_profiles"]["Row"];
export type MerchantProfileRow = Database["public"]["Tables"]["merchant_profiles"]["Row"];
export type WorkRow = Database["public"]["Tables"]["works"]["Row"];
export type GigRow = Database["public"]["Tables"]["gigs"]["Row"];
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
export type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
