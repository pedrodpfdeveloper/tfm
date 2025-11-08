import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { unstable_noStore as noStore } from 'next/cache';
import { Recipe, RecipeWithIngredients } from "./types";

interface GetRecipesParams {
    query?: string;
    ingredients?: string;
    duration?: string;
    page?: number;
}

export async function getAllIngredients() {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { data, error } = await supabase.from('ingredients').select('name').order('name', { ascending: true });

    if (error) {
        console.error('Error fetching ingredients:', error);
        return [];
    }
    return data;
}

type RecipeIdObject = { recipe_id: number };

export async function getRecipes({ query, ingredients, duration, page = 1 }: GetRecipesParams): Promise<{ recipes: Recipe[], totalCount: number }> {
    noStore();

    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    const recipesPerPage = 9;
    const offset = (page - 1) * recipesPerPage;

    let baseQuery = supabase.from('recipes').select('*', { count: 'exact' });

    if (!user) {
        baseQuery = baseQuery.eq('is_public', true);
    }

    if (query) {
        baseQuery = baseQuery.ilike('title', `%${query}%`);
    }

    if (duration) {
        const [min, max] = duration.split('-').map(Number);
        if (!isNaN(min)) baseQuery = baseQuery.gte('cook_time_minutes', min);
        if (!isNaN(max)) baseQuery = baseQuery.lte('cook_time_minutes', max);
    }

    if (ingredients && ingredients.length > 0) {
        const ingredientList = ingredients.split(',');

        const { data: recipeIds, error: rpcError } = await supabase.rpc('get_recipes_by_ingredients', { ingredient_names: ingredientList });

        if (rpcError || !recipeIds) {
            console.error('Error calling RPC function:', rpcError);
            return { recipes: [], totalCount: 0 };
        }

        const ids = (recipeIds as RecipeIdObject[]).map(r => r.recipe_id);

        if (ids.length === 0) {
            return { recipes: [], totalCount: 0 };
        }
        baseQuery = baseQuery.in('id', ids);
    }

    baseQuery = baseQuery.order('created_at', { ascending: false }).range(offset, offset + recipesPerPage - 1);

    const { data: recipes, error, count } = await baseQuery;

    if (error) {
        console.error('Error fetching recipes:', error);
        throw new Error('No se pudieron cargar las recetas.');
    }

    return { recipes: recipes ?? [], totalCount: count ?? 0 };
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