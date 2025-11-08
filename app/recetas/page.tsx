import { getRecipes } from "@/lib/data";
import RecipeCard from "@/components/recipes/RecipeCard";

export default async function RecipesPage() {
    const recipes = await getRecipes();

    const validRecipes = recipes.filter(recipe => recipe.id);

    return (
        <div className="max-w-[88rem] mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-10 text-[var(--primary)]">
                Nuestras Recetas
            </h1>

            {validRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {validRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-xl text-[var(--text)]/70">
                        No se encontraron recetas. ¡Vuelve pronto!
                    </p>
                </div>
            )}
        </div>
    );
}