import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account");
  }

  const isAdmin = user.email?.endsWith("@myhomeplan.ca") ?? false;

  if (!isAdmin) {
    redirect("/account");
  }

  return <>{children}</>;
}
