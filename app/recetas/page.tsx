import { getRecipes, getAllIngredients } from "@/lib/data";
import RecipeCard from "@/components/recipes/RecipeCard";
import RecipeFilters from "@/components/recipes/RecipeFilters";
import PaginationControls from "@/components/recipes/PaginationControls";
import Link from "next/link";
import { getAuthWithRole } from "@/lib/auth";

interface RecipesPageProps {
    searchParams?: {
        q?: string;
        ingredients?: string;
        duration?: string;
        page?: string;
    };
}

export default async function RecipesPage({ searchParams: searchParamsPromise }: RecipesPageProps) {
    const searchParams = await searchParamsPromise;
    const query = searchParams?.q || '';
    const ingredients = searchParams?.ingredients || '';
    const duration = searchParams?.duration || '';
    const currentPage = Number(searchParams?.page) || 1;

    const { isAdmin } = await getAuthWithRole();

    const { recipes, totalCount } = await getRecipes({
        query,
        ingredients,
        duration,
        page: currentPage,
    });

    const ingredientsList = await getAllIngredients();

    const validRecipes = recipes.filter(recipe => recipe.id);
    const totalPages = Math.ceil(totalCount / 9);

    return (
        <div className="max-w-[88rem] mx-auto px-6 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-[var(--primary)]">Nuestras Recetas</h1>
                <p className="mt-2 text-[var(--text)]/80">Encuentra la inspiración que necesitas para tu próxima comida.</p>
            </div>

            <RecipeFilters ingredientsList={ingredientsList} />

            {isAdmin && (
                <div className="mb-6 flex justify-end">
                    <Link href="/recetas/nueva" className="px-3 py-2 border rounded-md hover:bg-[var(--gray-50)]">
                        Nueva receta
                    </Link>
                </div>
            )}

            {validRecipes.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {validRecipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} isAdmin={isAdmin} />
                        ))}
                    </div>

                    <PaginationControls currentPage={currentPage} totalPages={totalPages} />
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-[var(--text)]/70">
                        No se encontraron recetas con los filtros seleccionados.
                    </p>
                </div>
            )}
        </div>
    );
}