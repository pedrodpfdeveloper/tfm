"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getAuthWithRole } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  const url = supabaseUrl;
  const key = serviceRoleKey;

  if (!url || !key) {
    throw new Error("Faltan las variables de entorno de Supabase para el panel de admin.");
  }

  return createClient(url, key);
}

async function ensureAdmin() {
  const { user, isAdmin } = await getAuthWithRole();
  if (!user || !isAdmin) {
    throw new Error("No autorizado");
  }
}

export async function changeUserRoleAction(formData: FormData) {
  await ensureAdmin();

  const userId = formData.get("userId");
  const roleId = formData.get("roleId");

  if (typeof userId !== "string" || typeof roleId !== "string") {
    throw new Error("Datos de formulario inválidos");
  }

  const parsedRoleId = Number(roleId);
  if (!Number.isInteger(parsedRoleId)) {
    throw new Error("Rol inválido");
  }

  const supabase = getAdminClient();

  const { error } = await supabase
    .from("users")
    .update({ role_id: parsedRoleId })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
}

export async function deleteUserAction(formData: FormData) {
  await ensureAdmin();

  const userId = formData.get("userId");
  if (typeof userId !== "string") {
    throw new Error("ID de usuario inválido");
  }

  const supabase = getAdminClient();

  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) {
    throw new Error(authError.message);
  }

  const { error: profileError } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (profileError) {
    throw new Error(profileError.message);
  }

  revalidatePath("/admin");
}

export async function createUserAction(formData: FormData) {
  await ensureAdmin();

  const email = formData.get("email");
  const password = formData.get("password");
  const roleId = formData.get("roleId");

  if (typeof email !== "string" || typeof password !== "string" || typeof roleId !== "string") {
    throw new Error("Datos de formulario inválidos");
  }

  const parsedRoleId = Number(roleId);
  if (!Number.isInteger(parsedRoleId)) {
    throw new Error("Rol inválido");
  }

  const supabase = getAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "No se pudo crear el usuario");
  }

  const { error: profileError } = await supabase
    .from("users")
    .upsert(
      {
        id: data.user.id,
        email,
        role_id: parsedRoleId,
      },
      { onConflict: "id" }
    );

  if (profileError) {
    throw new Error(profileError.message);
  }

  revalidatePath("/admin");
}
