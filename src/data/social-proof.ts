import { Home, Users, MapPin, TrendingDown, type LucideIcon } from "lucide-react";

export interface SocialProofStat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

export const SOCIAL_PROOF_STATS: SocialProofStat[] = [
  { icon: Home, value: 200, suffix: "+", label: "Homes Served", color: "text-primary" },
  { icon: Users, value: 50, suffix: "+", label: "Vetted Contractors", color: "text-emerald-500" },
  { icon: MapPin, value: 7, suffix: "", label: "Cities Covered", color: "text-sky-500" },
  { icon: TrendingDown, value: 35, suffix: "%", label: "Avg. Savings", color: "text-amber-500" },
];
