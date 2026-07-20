export const OCCUPATIONS = [
  "Developer",
  "Designer",
  "Doctor",
  "Nurse",
  "Teacher",
  "Student",
  "Lawyer",
  "Finance",
  "Marketer",
  "Engineer",
  "Scientist",
  "Writer",
  "Entrepreneur",
  "Other",
] as const;
export type Occupation = (typeof OCCUPATIONS)[number];

export const INTERESTS = [
  { id: "technology", label: "Tech" },
  { id: "business", label: "Business" },
  { id: "finance", label: "Finance" },
  { id: "health", label: "Health" },
  { id: "science", label: "Science" },
  { id: "politics", label: "Politics" },
  { id: "sports", label: "Sports" },
  { id: "entertainment", label: "Entertainment" },
  { id: "world", label: "World" },
  { id: "gaming", label: "Gaming" },
] as const;

export function isoWeekStart(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  if (day !== 1) date.setUTCDate(date.getUTCDate() - (day - 1));
  return date.toISOString().slice(0, 10);
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function randomRoomCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}