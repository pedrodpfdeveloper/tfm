import { getAuthWithRole } from "@/lib/auth";
import { createRecipe } from "../actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/forms/ImageUploader";

export default async function NewRecipePage() {
  const { isAdmin } = await getAuthWithRole();
  if (!isAdmin) redirect("/recetas");

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
        <h1 className="text-3xl font-bold">Nueva receta</h1>
      </div>
      <form action={createRecipe} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Título</label>
          <input name="title" required className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea name="description" className="w-full border rounded-md p-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm mb-1">Instrucciones</label>
          <textarea name="instructions" required className="w-full border rounded-md p-2" rows={6} />
        </div>
        <ImageUploader className="w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Prep. (min)</label>
            <input type="number" name="prep_time_minutes" className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cocción (min)</label>
            <input type="number" name="cook_time_minutes" className="w-full border rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Porciones</label>
            <input type="number" name="servings" className="w-full border rounded-md p-2" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="is_public" type="checkbox" name="is_public" defaultChecked />
          <label htmlFor="is_public">Pública</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 border rounded-md">Crear</button>
        </div>
      </form>
    </div>
  );
}
