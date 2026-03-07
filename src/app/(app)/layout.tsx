import { AppNav } from "@/components/layout/app-nav";

export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNav />
      <main className="min-h-screen">{children}</main>
    </>
  );
}
