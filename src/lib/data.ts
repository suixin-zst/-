import "server-only";
import {
  getGig as getDbGig,
  getHostRow,
  listGigs as listDbGigs,
  listHostUsers,
  type HostRow,
} from "./server/db";
import type { Gig, Host } from "./types";

/**
 * 数据访问层。页面只依赖这里，不直接碰 db.json。
 * 以后换 Supabase 时，只改本文件的实现。
 */

function toHost(row: HostRow): Host {
  return {
    id: row.user.id,
    name: row.user.name,
    city: row.profile.city,
    styles: row.profile.styles,
    tagline: row.profile.tagline,
    bio: row.profile.bio,
    priceHourly: row.profile.price_hourly,
    priceHalfDay: row.profile.price_half_day,
    priceFullDay: row.profile.price_full_day,
    experienceYears: row.profile.experience_years,
    verified: row.profile.is_verified,
    rating: Number(row.profile.rating) || 0,
    ratingCount: row.profile.rating_count,
    responseMinutes: row.profile.response_minutes,
    tone: row.profile.tone,
    works: row.works.map((work) => ({
      id: work.id,
      title: work.title,
      type: work.type,
      duration: work.duration,
      tone: work.tone,
      url: work.url || undefined,
    })),
    reviews: row.reviews.map((review) => ({
      id: review.id,
      merchant: review.merchant,
      rating: review.rating,
      content: review.content,
      date: review.date,
    })),
    availability: row.profile.availability ?? [],
  };
}

export async function getHosts(): Promise<Host[]> {
  const rows = await listHostUsers();
  return rows.map(toHost);
}

export async function getHost(id: string): Promise<Host | undefined> {
  const row = await getHostRow(id);
  return row ? toHost(row) : undefined;
}

export async function getFeaturedHosts(limit = 4): Promise<Host[]> {
  const hosts = await getHosts();
  return hosts
    .sort((a, b) => b.rating * b.ratingCount - a.rating * a.ratingCount)
    .slice(0, limit);
}

export async function getGigs(): Promise<Gig[]> {
  const gigs = await listDbGigs();
  return gigs.map((gig) => ({
    id: gig.id,
    merchantId: gig.merchant_id,
    title: gig.title,
    company: gig.company,
    type: gig.type,
    city: gig.city,
    eventDate: gig.event_date,
    duration: gig.duration,
    budgetMin: gig.budget_min,
    budgetMax: gig.budget_max,
    requirements: gig.requirements,
    description: gig.description,
    status: gig.status,
    applicants: gig.applicants,
    postedAt: gig.posted_at,
    tone: gig.tone,
  }));
}

export async function getGig(id: string): Promise<Gig | undefined> {
  const gig = await getDbGig(id);
  if (!gig) return undefined;
  return {
    id: gig.id,
    merchantId: gig.merchant_id,
    title: gig.title,
    company: gig.company,
    type: gig.type,
    city: gig.city,
    eventDate: gig.event_date,
    duration: gig.duration,
    budgetMin: gig.budget_min,
    budgetMax: gig.budget_max,
    requirements: gig.requirements,
    description: gig.description,
    status: gig.status,
    applicants: gig.applicants,
    postedAt: gig.posted_at,
    tone: gig.tone,
  };
}

export async function getFeaturedGigs(limit = 3): Promise<Gig[]> {
  const gigs = await getGigs();
  return gigs
    .filter((gig) => gig.status === "open")
    .sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1))
    .slice(0, limit);
}

export async function getSimilarGigs(gig: Gig, limit = 3): Promise<Gig[]> {
  const gigs = await getGigs();
  return gigs
    .filter((item) => item.id !== gig.id && item.type === gig.type)
    .slice(0, limit);
}

export async function getGigsForMerchant(merchantId: string): Promise<Gig[]> {
  const gigs = await getGigs();
  const dbGigs = await listDbGigs();
  const owned = new Set(
    dbGigs
      .filter((gig) => gig.merchant_id === merchantId)
      .map((gig) => gig.id),
  );
  return gigs.filter((gig) => owned.has(gig.id));
}
