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

    if (!duration) {
        baseQuery = baseQuery.order('created_at', { ascending: false }).range(offset, offset + recipesPerPage - 1);

        const { data: recipes, error, count } = await baseQuery;

        if (error) {
            console.error('Error fetching recipes:', error);
            throw new Error('No se pudieron cargar las recetas.');
        }

        return { recipes: recipes ?? [], totalCount: count ?? 0 };
    }

    baseQuery = baseQuery.order('created_at', { ascending: false });

    const { data: recipes, error } = await baseQuery;

    if (error) {
        console.error('Error fetching recipes:', error);
        throw new Error('No se pudieron cargar las recetas.');
    }

    const [minStr, maxStr] = duration.split('-');
    const min = minStr ? Number(minStr) : NaN;
    const max = maxStr ? Number(maxStr) : NaN;

    const filteredRecipes = (recipes ?? []).filter((recipe) => {
        const prep = typeof recipe.prep_time_minutes === 'number' ? recipe.prep_time_minutes : 0;
        const cook = typeof recipe.cook_time_minutes === 'number' ? recipe.cook_time_minutes : 0;
        const total = prep + cook;

        if (!Number.isNaN(min) && total < min) return false;
        if (!Number.isNaN(max) && total > max) return false;
        return true;
    });

    const totalCount = filteredRecipes.length;
    const paginatedRecipes = filteredRecipes.slice(offset, offset + recipesPerPage);

    return { recipes: paginatedRecipes, totalCount };
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

export async function getRandomPublicRecipes(limit: number = 6): Promise<Recipe[]> {
    noStore();

    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)
        .limit(30);

    if (error || !data) {
        console.error('Error fetching random public recipes:', error);
        return [];
    }

    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
}

export type RecipeAndIngredientStats = {
    totalRecipes: number;
    publicRecipes: number;
    privateRecipes: number;
    totalIngredients: number;
};

export async function getRecipeAndIngredientStats(): Promise<RecipeAndIngredientStats> {
    noStore();

    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const [
        { count: totalRecipes, error: totalRecipesError },
        { count: publicRecipes, error: publicRecipesError },
        { count: privateRecipes, error: privateRecipesError },
        { count: totalIngredients, error: totalIngredientsError },
    ] = await Promise.all([
        supabase.from('recipes').select('id', { count: 'exact', head: true }),
        supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('is_public', true),
        supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('is_public', false),
        supabase.from('ingredients').select('id', { count: 'exact', head: true }),
    ]);

    if (totalRecipesError) {
        console.error('Error counting all recipes:', totalRecipesError);
    }
    if (publicRecipesError) {
        console.error('Error counting public recipes:', publicRecipesError);
    }
    if (privateRecipesError) {
        console.error('Error counting private recipes:', privateRecipesError);
    }
    if (totalIngredientsError) {
        console.error('Error counting ingredients:', totalIngredientsError);
    }

    return {
        totalRecipes: totalRecipes ?? 0,
        publicRecipes: publicRecipes ?? 0,
        privateRecipes: privateRecipes ?? 0,
        totalIngredients: totalIngredients ?? 0,
    };
}

type RoleRef = {
    name: string | null;
};

type RawUserRow = {
    id: string;
    email: string | null;
    role_id: number;
    roles: RoleRef | RoleRef[] | null;
};

export type UserWithRole = {
    id: string;
    email: string | null;
    roleId: number;
    roles: RoleRef[];
};

export async function getAllUsersWithRoles(): Promise<UserWithRole[]> {
    noStore();

    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
        .from('users')
        .select('id, email, role_id, roles(name)')
        .order('created_at', { ascending: true });

    if (error || !data) {
        console.error('Error fetching users with roles:', error);
        return [];
    }

    const rows = data as RawUserRow[];

    return rows.map((row) => {
        const rolesArray: RoleRef[] = Array.isArray(row.roles)
            ? row.roles
            : row.roles
                ? [row.roles]
                : [];

        return {
            id: row.id,
            email: row.email,
            roleId: row.role_id,
            roles: rolesArray.map((role) => ({ name: role.name })),
        };
    });
}

export type Role = {
    id: number;
    name: string;
};

export async function getAllRoles(): Promise<Role[]> {
    noStore();

    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
        .from('roles')
        .select('id, name')
        .order('id', { ascending: true });

    if (error || !data) {
        console.error('Error fetching roles:', error);
        return [];
    }

    return data as Role[];
}