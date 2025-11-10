import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function getAuthWithRole() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null as typeof user, role: null as string | null, isAdmin: false };

  const { data, error } = await supabase
    .from("users")
    .select("roles(name)")
    .eq("id", user.id)
    .single();

  if (error) {
    return { user, role: null as string | null, isAdmin: false };
  }

  const roleName = (data as any)?.roles?.name ?? null;
  return { user, role: roleName as string | null, isAdmin: roleName === "admin" };
}
