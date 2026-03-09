import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface FeatureItem {
  icon?: LucideIcon;
  title: string;
  description: string;
}

interface FeatureProps {
  badge?: string;
  title: string;
  subtitle?: string;
  items: FeatureItem[];
  columns?: 2 | 3;
}

function Feature({ badge, title, subtitle, items, columns = 3 }: FeatureProps) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start gap-4">
            {badge && (
              <div>
                <Badge>{badge}</Badge>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-5xl">
                {title}
              </h2>
              {subtitle && (
                <p className="max-w-xl text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-lg">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div
            className={`grid grid-cols-1 gap-8 sm:grid-cols-2 ${
              columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            }`}
          >
            {items.map((item) => (
              <div key={item.title} className="flex flex-col gap-2">
                <div className="mb-2 aspect-video rounded-md bg-muted" />
                <h3 className="text-xl tracking-tight">{item.title}</h3>
                <p className="text-base text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
export type { FeatureItem, FeatureProps };
