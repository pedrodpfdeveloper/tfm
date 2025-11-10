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

            {isAdmin && (
                <div className="mb-6 flex justify-center">
                    <Link href="/recetas/nueva" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--primary)] text-white hover:opacity-90 shadow-sm">
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span>Nueva receta</span>
                    </Link>
                </div>
            )}

            <RecipeFilters ingredientsList={ingredientsList} />

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