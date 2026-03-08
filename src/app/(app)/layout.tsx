import { AppNav } from "@/components/layout/app-nav";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNav />
      <main className="min-h-screen">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </>
  );
}
