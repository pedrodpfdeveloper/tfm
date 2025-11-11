import { getAuthWithRole } from "@/lib/auth";
import { getRecipeById } from "@/lib/data";
import { updateRecipe } from "@/app/recetas/actions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: { recipeId: string } | Promise<{ recipeId: string }>;
}

export default async function EditRecipePage({ params }: Props) {
  const p = await params;
  const { isAdmin } = await getAuthWithRole();
  if (!isAdmin) redirect("/recetas");

  const recipe = await getRecipeById(p.recipeId);
  if (!recipe) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/recetas"
          aria-label="Volver a recetas"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-[var(--button-bg,white)] text-[var(--button-text,#111)] hover:bg-[var(--gray-50)] dark:bg-gray-800 dark:text-white"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <span>Volver</span>
        </Link>
        <h1 className="text-3xl font-bold">Editar receta</h1>
      </div>
      <form action={updateRecipe} className="space-y-4">
        <input type="hidden" name="id" value={recipe.id} />
        <div>
          <label className="block text-sm mb-1">Título</label>
          <input name="title" defaultValue={recipe.title} required className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea name="description" defaultValue={recipe.description ?? ""} className="w-full border rounded-md p-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm mb-1">Instrucciones</label>
          <textarea name="instructions" defaultValue={recipe.instructions} required className="w-full border rounded-md p-2" rows={6} />
        </div>
        <div>
          <label className="block text-sm mb-1">URL de imagen</label>
          <input name="image_url" defaultValue={recipe.image_url ?? ""} className="w-full border rounded-md p-2" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Prep. (min)</label>
            <input type="number" name="prep_time_minutes" defaultValue={recipe.prep_time_minutes ?? undefined} className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cocción (min)</label>
            <input type="number" name="cook_time_minutes" defaultValue={recipe.cook_time_minutes ?? undefined} className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Porciones</label>
            <input type="number" name="servings" defaultValue={recipe.servings ?? undefined} className="w-full border rounded-md p-2" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="is_public" type="checkbox" name="is_public" defaultChecked={recipe.is_public} />
          <label htmlFor="is_public">Pública</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 border rounded-md">Guardar</button>
        </div>
      </form>
    </div>
  );
}
