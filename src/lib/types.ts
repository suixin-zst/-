export type Role = "host" | "merchant";

export type HostStyle = "婚礼" | "年会" | "发布会" | "路演" | "展会" | "直播";

export type GigType = HostStyle;

export type GigStatus = "open" | "matched" | "closed";

export type Tone =
  | "rose"
  | "ink"
  | "gold"
  | "jade"
  | "blue"
  | "plum"
  | "sage"
  | "teal"
  | "sand";

export interface Work {
  id: string;
  title: string;
  type: "video" | "image" | "audio";
  duration: string;
  tone: Tone;
  url?: string;
}

export interface Review {
  id: string;
  merchant: string;
  rating: number;
  content: string;
  date: string;
}

export interface AvailabilityDay {
  date: string;
  weekday: string;
  open: boolean;
}

export interface Host {
  id: string;
  name: string;
  city: string;
  styles: HostStyle[];
  tagline: string;
  bio: string;
  priceHourly: number;
  priceHalfDay: number;
  priceFullDay: number;
  experienceYears: number;
  verified: boolean;
  rating: number;
  ratingCount: number;
  responseMinutes: number;
  tone: Tone;
  works: Work[];
  reviews: Review[];
  availability: AvailabilityDay[];
}

export interface Gig {
  id: string;
  merchantId?: string;
  title: string;
  company: string;
  type: GigType;
  city: string;
  eventDate: string;
  duration: string;
  budgetMin: number;
  budgetMax: number;
  requirements: string[];
  description: string;
  status: GigStatus;
  applicants: number;
  postedAt: string;
  tone: Tone;
}
