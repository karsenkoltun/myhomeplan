"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[BlogError]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-6 w-6 text-destructive"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <CardTitle className="text-xl">Couldn&apos;t load blog</CardTitle>
          <CardDescription>
            We had trouble loading the blog content. This might be a temporary issue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="outline" asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && error && (
            <details className="mt-6">
              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded-md bg-muted p-3 text-xs text-muted-foreground">
                {error.message}
                {"\n"}
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
