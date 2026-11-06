import { SignupForm } from "./signup-form";
import type { Role } from "@/lib/types";

export const metadata = { title: "注册 · 台前" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole: Role = role === "merchant" ? "merchant" : "host";
  return <SignupForm initialRole={initialRole} />;
}
