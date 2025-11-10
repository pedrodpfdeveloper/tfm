import Link from 'next/link';
import Image from 'next/image';
import { Recipe } from '@/lib/types';
import { deleteRecipe } from '@/app/recetas/actions';


interface RecipeCardProps {
    recipe: Recipe;
    isAdmin?: boolean;
}


export default function RecipeCard({ recipe, isAdmin = false }: RecipeCardProps) {
    return (
        <div className="border border-[var(--gray-200)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <Link href={`/recetas/${recipe.id}`} className="block group">
                <div className="relative w-full aspect-video">
                    <Image
                        src={recipe.image_url || '/placeholder-image.png'}
                        alt={`Imagen de ${recipe.title}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        loading="eager"
                    />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[var(--primary)] mb-2">{recipe.title}</h3>
                    <p className="text-[var(--text)]/80 text-sm line-clamp-3 flex-grow">{recipe.description}</p>
                    <div className="flex justify-between items-center mt-4 text-xs text-[var(--text)]/60">
                        <span><span className="font-semibold">Preparación:</span> {recipe.prep_time_minutes} min</span>
                        <span><span className="font-semibold">Cocción:</span> {recipe.cook_time_minutes} min</span>
                    </div>
                </div>
            </Link>

            {isAdmin && (
                <div className="p-4 pt-0 flex gap-2">
                    <Link
                        href={`/recetas/${recipe.id}/editar`}
                        className="px-3 py-1 text-sm border rounded-md hover:bg-[var(--gray-50)]"
                    >
                        Editar
                    </Link>
                    <form action={deleteRecipe} className="ml-auto">
                        <input type="hidden" name="id" value={recipe.id} />
                        <button
                            type="submit"
                            className="px-3 py-1 text-sm border rounded-md text-red-600 hover:bg-red-50"
                        >
                            Eliminar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}