import { type LucideIcon, CheckCircle2, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap, Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, TreePine, Flower2, CloudRain, PaintBucket, Layers, Umbrella, SprayCan, Wind, Fan, DoorOpen, Flame, Heater, Refrigerator, Gauge, LifeBuoy, Shield, Trash2, Car, ArrowUpDown, Wifi, DollarSign, Home } from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
  TreePine, Flower2, CloudRain, PaintBucket, Layers, Umbrella, SprayCan,
  Wind, Fan, DoorOpen, Flame, Heater, Refrigerator, Gauge, LifeBuoy, Shield, Trash2,
  Car, ArrowUpDown, Wifi, DollarSign, Home,
};

export function getServiceIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || CheckCircle2;
}
