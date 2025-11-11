import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function getAuthWithRole() {
  noStore();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null as typeof user, role: null as string | null, isAdmin: false };

  let { data, error } = await supabase
    .from("users")
    .select("roles(name)")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    await supabase.from("users").insert({ id: user.id }).select("id").maybeSingle();
    const retry = await supabase
      .from("users")
      .select("roles(name)")
      .eq("id", user.id)
      .maybeSingle();
    data = retry.data as any;
    error = retry.error as any;
  }

  let isAdmin = false;
  try {
    const { data: adminData } = await supabase.rpc('is_admin');
    if (typeof adminData === 'boolean') isAdmin = adminData;
  } catch {}

  const roleName = (data as any)?.roles?.name ?? null;
  return { user, role: roleName as string | null, isAdmin };
}
