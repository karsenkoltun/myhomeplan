import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { BlogCTAInline, BlogCTABanner, BlogCTACompare } from "./blog-cta";
import { BlogFAQ } from "./blog-faq";
import { Info, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip" | "success";
  children: React.ReactNode;
}) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    tip: Lightbulb,
    success: CheckCircle,
  };
  const colors = {
    info: "border-blue-500/30 bg-blue-50 dark:bg-blue-950/20",
    warning: "border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20",
    tip: "border-purple-500/30 bg-purple-50 dark:bg-purple-950/20",
    success: "border-green-500/30 bg-green-50 dark:bg-green-950/20",
  };
  const iconColors = {
    info: "text-blue-600",
    warning: "text-yellow-600",
    tip: "text-purple-600",
    success: "text-green-600",
  };

  const Icon = icons[type];

  return (
    <Alert className={`my-4 ${colors[type]}`}>
      <Icon className={`h-4 w-4 ${iconColors[type]}`} />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

function CostTable({
  headers,
  rows,
}: {
  headers?: string[];
  rows?: string[][];
}) {
  if (!headers || !rows || !Array.isArray(headers) || !Array.isArray(rows)) {
    return null;
  }

  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b">
              {(Array.isArray(row) ? row : [row]).map((cell, j) => (
                <td key={j} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Quote({
  children,
  author,
}: {
  children: React.ReactNode;
  author?: string;
}) {
  return (
    <Card className="my-6">
      <CardContent className="p-6">
        <blockquote className="border-l-4 border-primary pl-4 text-lg italic text-muted-foreground">
          {children}
        </blockquote>
        {author && (
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            - {author}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export const mdxComponents = {
  Callout,
  CostTable,
  Quote,
  CTA: BlogCTAInline,
  CTABanner: BlogCTABanner,
  CTACompare: BlogCTACompare,
  FAQ: BlogFAQ,
  h2: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof children === "string" ? children : "";
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return (
      <h2
        id={id}
        className="mt-10 mb-4 scroll-mt-20 text-2xl font-bold tracking-tight"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof children === "string" ? children : "";
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return (
      <h3
        id={id}
        className="mt-8 mb-3 scroll-mt-20 text-xl font-semibold tracking-tight"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-7 text-muted-foreground" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-muted-foreground" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-primary/30 pl-4 italic text-muted-foreground"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure className="my-6">
      <img
        className="w-full rounded-lg"
        loading="lazy"
        {...props}
      />
      {props.alt && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),
};
