"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getAuthWithRole } from "@/lib/auth";

function toBool(v: FormDataEntryValue | null) {
  if (v === null) return false;
  const s = String(v).toLowerCase();
  return s === "true" || s === "on" || s === "1";
}

function toInt(v: FormDataEntryValue | null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function deleteRecipe(formData: FormData) {
  const { isAdmin } = await getAuthWithRole();
  if (!isAdmin) return;

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  const supabase = await createClient(cookies());
  await supabase.from("recipe_ingredients").delete().eq("recipe_id", id);
  await supabase.from("recipes").delete().eq("id", id);

  revalidatePath("/recetas");
}

export async function createRecipe(formData: FormData) {
  const { isAdmin } = await getAuthWithRole();
  if (!isAdmin) redirect("/recetas");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const prep_time_minutes = toInt(formData.get("prep_time_minutes"));
  const cook_time_minutes = toInt(formData.get("cook_time_minutes"));
  const servings = toInt(formData.get("servings"));
  const is_public = toBool(formData.get("is_public"));

  const supabase = await createClient(cookies());
  const { data, error } = await supabase
    .from("recipes")
    .insert({
      title,
      description,
      instructions,
      image_url,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      is_public,
    })
    .select("id")
    .single();

  revalidatePath("/recetas");
  if (error || !data) redirect("/recetas");
  redirect(`/recetas/${data.id}`);
}

export async function updateRecipe(formData: FormData) {
  const { isAdmin } = await getAuthWithRole();
  if (!isAdmin) redirect("/recetas");

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) redirect("/recetas");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const prep_time_minutes = toInt(formData.get("prep_time_minutes"));
  const cook_time_minutes = toInt(formData.get("cook_time_minutes"));
  const servings = toInt(formData.get("servings"));
  const is_public = toBool(formData.get("is_public"));

  const supabase = await createClient(cookies());
  await supabase
    .from("recipes")
    .update({
      title,
      description,
      instructions,
      image_url,
      prep_time_minutes,
      cook_time_minutes,
      servings,
      is_public,
    })
    .eq("id", id);

  revalidatePath("/recetas");
  redirect(`/recetas/${id}`);
}
