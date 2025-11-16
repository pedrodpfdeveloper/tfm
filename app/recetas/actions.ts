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
  const imageUrl = typeof recipeRow?.image_url === "string" ? recipeRow.image_url : null;
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

  if (!error && data) {
    const ingredientNames = formData
      .getAll("ingredient_name")
      .map((v) => String(v).trim());
    const ingredientQuantities = formData
      .getAll("ingredient_quantity")
      .map((v) => String(v).trim());

    const items = ingredientNames
      .map((name, index) => ({
        name,
        quantity: ingredientQuantities[index] ?? "",
      }))
      .filter((item) => item.name.length > 0);

    if (items.length > 0) {
      const uniqueNames = Array.from(new Set(items.map((item) => item.name)));

      let existing: { id: number; name: string }[] = [];
      const { data: existingRows, error: existingError } = await supabase
        .from("ingredients")
        .select("id, name")
        .in("name", uniqueNames);

      if (!existingError && existingRows) {
        existing = existingRows as { id: number; name: string }[];
      }

      const existingByName = new Map<string, number>(
        existing.map((row) => [row.name, row.id])
      );

      const namesToInsert = uniqueNames.filter(
        (name) => !existingByName.has(name)
      );

      if (namesToInsert.length > 0) {
        const { data: insertedRows, error: insertError } = await supabase
          .from("ingredients")
          .insert(namesToInsert.map((name) => ({ name })))
          .select("id, name");

        if (!insertError && insertedRows) {
          for (const row of insertedRows as { id: number; name: string }[]) {
            existingByName.set(row.name, row.id);
          }
        }
      }

      const recipeIngredientsRows = items
        .map((item) => {
          const ingredientId = existingByName.get(item.name);
          if (!ingredientId) return null;
          return {
            recipe_id: data.id,
            ingredient_id: ingredientId,
            quantity: item.quantity || null,
          };
        })
        .filter((row) => row !== null) as {
        recipe_id: number;
        ingredient_id: number;
        quantity: string | null;
      }[];

      if (recipeIngredientsRows.length > 0) {
        await supabase.from("recipe_ingredients").insert(recipeIngredientsRows);
      }
    }
  }

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
  const hadPreviousImage = !!image_url;
  if (isFile(image) && image.size > 0) {
    const bucket = "recipe-images";
    if (hadPreviousImage) {
      try {
        const url = new URL(image_url as string);
        const prefix = `/storage/v1/object/public/${bucket}/`;
        if (url.pathname.startsWith(prefix)) {
          const filePathToDelete = url.pathname.slice(prefix.length);
          if (filePathToDelete) {
            await supabase.storage.from(bucket).remove([filePathToDelete]);
          }
        }
      } catch {}
    }

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
  const { error } = await supabase
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

  if (!error) {
    const ingredientNames = formData
      .getAll("ingredient_name")
      .map((v) => String(v).trim());
    const ingredientQuantities = formData
      .getAll("ingredient_quantity")
      .map((v) => String(v).trim());

    const items = ingredientNames
      .map((name, index) => ({
        name,
        quantity: ingredientQuantities[index] ?? "",
      }))
      .filter((item) => item.name.length > 0);

    await supabase.from("recipe_ingredients").delete().eq("recipe_id", id);

    if (items.length > 0) {
      const uniqueNames = Array.from(new Set(items.map((item) => item.name)));

      let existing: { id: number; name: string }[] = [];
      const { data: existingRows, error: existingError } = await supabase
        .from("ingredients")
        .select("id, name")
        .in("name", uniqueNames);

      if (!existingError && existingRows) {
        existing = existingRows as { id: number; name: string }[];
      }

      const existingByName = new Map<string, number>(
        existing.map((row) => [row.name, row.id])
      );

      const namesToInsert = uniqueNames.filter(
        (name) => !existingByName.has(name)
      );

      if (namesToInsert.length > 0) {
        const { data: insertedRows, error: insertError } = await supabase
          .from("ingredients")
          .insert(namesToInsert.map((name) => ({ name })))
          .select("id, name");

        if (!insertError && insertedRows) {
          for (const row of insertedRows as { id: number; name: string }[]) {
            existingByName.set(row.name, row.id);
          }
        }
      }

      const recipeIngredientsRows = items
        .map((item) => {
          const ingredientId = existingByName.get(item.name);
          if (!ingredientId) return null;
          return {
            recipe_id: id,
            ingredient_id: ingredientId,
            quantity: item.quantity || null,
          };
        })
        .filter((row) => row !== null) as {
        recipe_id: number;
        ingredient_id: number;
        quantity: string | null;
      }[];

      if (recipeIngredientsRows.length > 0) {
        await supabase
          .from("recipe_ingredients")
          .insert(recipeIngredientsRows);
      }
    }
  }

  revalidatePath("/recetas");
  redirect(`/recetas/${id}`);
}
