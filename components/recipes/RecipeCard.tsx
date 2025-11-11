"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Recipe } from '@/lib/types';
import { deleteRecipe } from '@/app/recetas/actions';
import { useState } from 'react';


interface RecipeCardProps {
    recipe: Recipe;
    isAdmin?: boolean;
}


export default function RecipeCard({ recipe, isAdmin = false }: RecipeCardProps) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative border border-[var(--gray-200)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
            <Link href={`/recetas/${recipe.id}`} className="block group flex-1">
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

                <div className="p-4 flex flex-col">
                    <h3 className="text-xl font-bold text-[var(--primary)] mb-2 line-clamp-2 min-h-[2.75rem]">{recipe.title}</h3>
                    <p className="text-[var(--text)]/80 text-sm line-clamp-3 min-h-[3.75rem]">{recipe.description}</p>
                    <div className="flex justify-between items-center mt-4 text-xs text-[var(--text)]/60">
                        <span><span className="font-semibold">Preparación:</span> {recipe.prep_time_minutes} min</span>
                        <span><span className="font-semibold">Cocción:</span> {recipe.cook_time_minutes} min</span>
                    </div>
                </div>
            </Link>

            {isAdmin && (
                <div className="p-4 pt-0 flex items-center gap-2 mt-auto">
                    <Link
                        href={`/recetas/${recipe.id}/editar`}
                        aria-label={`Editar ${recipe.title}`}
                        title="Editar"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-[var(--primary)] text-white hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                    >
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        <span>Editar</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label={`Eliminar ${recipe.title}`}
                        title="Eliminar"
                        className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                        <span>Eliminar</span>
                    </button>

                    {open && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                            <div
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby={`dialog-title-${recipe.id}`}
                                className="relative z-[61] w-full max-w-sm rounded-lg p-5 shadow-xl bg-[var(--modal-bg,white)] text-[var(--modal-text,#111)] dark:bg-gray-900 dark:text-white"
                            >
                                <h3 id={`dialog-title-${recipe.id}`} className="text-lg font-semibold mb-2">Confirmar eliminación</h3>
                                <p className="text-sm mb-4">¿Seguro que quieres eliminar la receta &quot;{recipe.title}&quot;? Esta acción no se puede deshacer.</p>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="px-3 py-1.5 text-sm rounded-md bg-[var(--button-bg,white)] text-[var(--button-text,#111)] hover:bg-[var(--gray-50)] dark:bg-gray-800 dark:text-white"
                                    >
                                        Cancelar
                                    </button>
                                    <form action={deleteRecipe}>
                                        <input type="hidden" name="id" value={recipe.id} />
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                                        >
                                            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                                            <span>Eliminar</span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}