import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { unstable_noStore as noStore } from 'next/cache';
import { Recipe, RecipeWithIngredients } from "./types";

export async function getRecipes(): Promise<Recipe[]> {
    noStore();

    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase.from('recipes').select('*');

    if (!user) {
        query = query.eq('is_public', true);
    }

    const { data: recipes, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching recipes:', error);
        throw new Error('No se pudieron cargar las recetas.');
    }

    return recipes;
}

export async function getRecipeById(id: string): Promise<RecipeWithIngredients | null> {
    noStore();
    if (!id) return null;

    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
        .from('recipes')
        .select(`
            *,
            recipe_ingredients (
              quantity,
              ingredients (
                name
              )
            )
        `)
        .eq('id', id);

    if (!user) {
        query = query.eq('is_public', true);
    }

    const { data: recipe, error } = await query.single();

    if (error) {
        console.error('Error fetching recipe by id:', error);
        return null;
    }

    return recipe;
}