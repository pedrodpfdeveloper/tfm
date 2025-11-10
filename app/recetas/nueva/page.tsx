import { getAuthWithRole } from "@/lib/auth";
import { createRecipe } from "../actions";
import { redirect } from "next/navigation";

export default async function NewRecipePage() {
  const { isAdmin } = await getAuthWithRole();
  if (!isAdmin) redirect("/recetas");

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Nueva receta</h1>
      <form action={createRecipe} className="space-y-4">
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
        <div>
          <label className="block text-sm mb-1">URL de imagen</label>
          <input name="image_url" className="w-full border rounded-md p-2" />
        </div>
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
