import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

type UserProfileRow = {
  id: string;
  email: string | null;
  role_id: number;
  roles: { name: string | null } | null;
};

export async function getAuthWithRole() {
  noStore();
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null as typeof user, role: null as string | null, isAdmin: false };

  const { data, error } = await supabase
    .from("users")
    .select("id, email, role_id, roles(name)")
    .eq("id", user.id)
    .maybeSingle<UserProfileRow>();

  let profile = data ?? null;

  if (!profile) {
    const insertResult = await supabase
      .from("users")
      .insert({
        id: user.id,
        email: user.email,
      })
      .select("id, email, role_id, roles(name)")
      .maybeSingle<UserProfileRow>();

    if (insertResult.error) {
      console.error("Error inserting user profile:", insertResult.error);
    }

    profile = insertResult.data ?? null;
  } else if (profile.email !== user.email) {
    await supabase
      .from("users")
      .update({ email: user.email })
      .eq("id", user.id);
  }

  let isAdmin = false;
  try {
    const { data: adminData } = await supabase.rpc("is_admin");
    if (typeof adminData === "boolean") isAdmin = adminData;
  } catch {}

  const roleName = profile?.roles?.name ?? null;
  return { user, role: roleName as string | null, isAdmin };
}
