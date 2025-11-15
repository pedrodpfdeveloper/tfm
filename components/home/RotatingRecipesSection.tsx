import Link from "next/link";
import Image from "next/image";
import { getRandomPublicRecipes } from "@/lib/data";

export default async function RotatingRecipesSection() {
  const recipes = await getRandomPublicRecipes(6);

  if (!recipes.length) return null;

  const items = [...recipes, ...recipes];

  return (
    <section className="bg-[var(--background-50)] py-10">
      <div className=" mx-auto px-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-2">
            Sabores en movimiento
          </h3>
        </div>
        <div className="group relative overflow-hidden">
          <div className="flex gap-6 animate-scroll-recipes pause-on-hover">
            {items.map((recipe, index) => (
              <Link
                key={`${recipe.id}-${index}`}
                href={`/recetas/${recipe.id}`}
                className="min-w-[260px] max-w-[260px] sm:min-w-[280px] sm:max-w-[280px]"
              >
                <article className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-md bg-[var(--background-100)] hover:shadow-xl transition-shadow duration-300">
                  <div className="relative w-full h-full">
                    <Image
                      src={recipe.image_url || "/placeholder-image.png"}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 640px) 260px, 280px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 space-y-1">
                      <h4 className="text-sm font-semibold text-white line-clamp-2">
                        {recipe.title}
                      </h4>
                      {recipe.prep_time_minutes != null && recipe.cook_time_minutes != null && (
                        <p className="text-[11px] text-gray-100/90">
                          Prep. {recipe.prep_time_minutes} min · Cocción {recipe.cook_time_minutes} min
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
