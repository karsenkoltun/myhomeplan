import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-x-clip">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
