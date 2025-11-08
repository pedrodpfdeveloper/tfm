import { getRecipeById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from 'next/image';

type Params = { recipeId: string };

interface RecipeDetailPageProps {
    params: Params | Promise<Params>;
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
    const { recipeId } = await params;

    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-4">{recipe.title}</h1>
            <p className="text-lg text-[var(--text)]/80 mb-8">{recipe.description}</p>
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
                <Image
                    src={recipe.image_url || '/placeholder-image.png'}
                    alt={`Imagen de ${recipe.title}`}
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10 p-4 border rounded-lg bg-[var(--background-50)]">
                <div className="text-center">
                    <p className="font-bold text-lg">{recipe.prep_time_minutes} min</p>
                    <p className="text-sm text-[var(--text)]/70">Preparación</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-lg">{recipe.cook_time_minutes} min</p>
                    <p className="text-sm text-[var(--text)]/70">Cocción</p>
                </div>
                <div className="text-center">
                    <p className="font-bold text-lg">{recipe.servings}</p>
                    <p className="text-sm text-[var(--text)]/70">Porciones</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1">
                    <h2 className="text-2xl font-bold mb-4 border-b-2 border-[var(--primary)] pb-2">Ingredientes</h2>
                    <ul className="space-y-2 list-disc list-inside">
                        {recipe.recipe_ingredients.map((item, index) => (
                            <li key={index}>
                                <span className="font-semibold">{item.ingredients.name}:</span> {item.quantity}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-4 border-b-2 border-[var(--primary)] pb-2">Instrucciones</h2>
                    <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                        {recipe.instructions}
                    </div>
                </div>
            </div>
        </article>
    );
}

export async function generateMetadata({ params }: RecipeDetailPageProps) {
    const { recipeId } = await params;
    const recipe = await getRecipeById(recipeId);

    if (!recipe) {
        return { title: 'Receta no encontrada' };
    }

    return {
        title: `${recipe.title} | Sabores Caseros`,
        description: recipe.description,
    };
}
