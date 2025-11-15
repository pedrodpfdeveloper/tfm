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

function isFile(v: FormDataEntryValue | null): v is File {
    return v instanceof File;
}

export async function deleteRecipe(formData: FormData) {
  const { isAdmin } = await getAuthWithRole();
  if (!isAdmin) return;

  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  const supabase = await createClient(cookies());
  const { data: recipeRow } = await supabase
    .from("recipes")
    .select("image_url")
    .eq("id", id)
    .single();

  const bucket = "recipe-images";
  const imageUrl: string | null | undefined = recipeRow?.image_url as any;
  if (imageUrl) {
    try {
      const url = new URL(imageUrl);
      const prefix = `/storage/v1/object/public/${bucket}/`;
      if (url.pathname.startsWith(prefix)) {
        const filePath = url.pathname.slice(prefix.length);
        if (filePath) {
          await supabase.storage.from(bucket).remove([filePath]);
        }
      }
    } catch {}
  }
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
  const prep_time_minutes = toInt(formData.get("prep_time_minutes"));
  const cook_time_minutes = toInt(formData.get("cook_time_minutes"));
  const servings = toInt(formData.get("servings"));
  const is_public = toBool(formData.get("is_public"));

  const supabase = await createClient(cookies());
  const image = formData.get("image");
  let image_url: string | null = null;
  if (isFile(image) && image.size > 0) {
    const bucket = "recipe-images";
    const fileExt = image.name?.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `recipes/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, image, { upsert: true, contentType: image.type || undefined, cacheControl: "3600" });
    if (!uploadError) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      image_url = data.publicUrl;
    }
  }

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
  const prep_time_minutes = toInt(formData.get("prep_time_minutes"));
  const cook_time_minutes = toInt(formData.get("cook_time_minutes"));
  const servings = toInt(formData.get("servings"));
  const is_public = toBool(formData.get("is_public"));

  const supabase = await createClient(cookies());
  const image = formData.get("image");
  let image_url = String(formData.get("existing_image_url") ?? "").trim() || null;
  if (isFile(image) && image.size > 0) {
    const bucket = "recipe-images";
    const fileExt = image.name?.split(".").pop() || "jpg";
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `recipes/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, image, { upsert: true, contentType: image.type || undefined, cacheControl: "3600" });
    if (!uploadError) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      image_url = data.publicUrl;
    }
  }
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
