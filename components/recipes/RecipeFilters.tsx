"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface RecipeFiltersProps {
    ingredientsList: { name: string }[];
}

export default function RecipeFilters({ ingredientsList }: RecipeFiltersProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const raw = searchParams.get("ingredients") ?? "";
        if (!raw) {
            setSelected([]);
            return;
        }
        const values = raw.split(",").filter(Boolean);
        setSelected(values);
    }, [searchParams.toString()]);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(searchParams as any);
        params.set("page", "1");
        if (selected.length) params.set("ingredients", selected.join(","));
        else params.delete("ingredients");
        router.replace(`${pathname}?${params.toString()}`);
    }, [selected]);

    const toggleSelect = (name: string) => {
        setSelected((prev) => {
            if (prev.includes(name)) return prev.filter((p) => p !== name);
            return [...prev, name];
        });
    };

    const removeTag = (name: string, e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setSelected((prev) => prev.filter((p) => p !== name));
    };

    return (
        <div className="mb-8 flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-[var(--card-bg,theme(colors.gray.50))]">
            <input
                type="search"
                placeholder="Buscar por nombre..."
                defaultValue={searchParams.get("q") ?? ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-grow p-2 border rounded-md bg-[var(--input-bg,transparent)] text-[var(--input-text,#000)] border-[var(--input-border,#d1d5db)]"
            />

            <div ref={wrapperRef} className="relative w-full md:w-72">
                <div
                    role="button"
                    tabIndex={0}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => setOpen((o) => !o)}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen((o) => !o)}
                    className="relative w-full text-left p-2 pr-10 border rounded-md flex flex-wrap items-center gap-2 min-h-[44px] bg-[var(--select-bg,white)] text-[var(--select-text,#000)] border-[var(--select-border,#d1d5db)] cursor-pointer"
                >
                    {selected.length === 0 ? (
                        <span className="opacity-60">Todos los ingredientes</span>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {selected.map((s) => (
                                <span
                                    key={s}
                                    className="flex items-center gap-2 text-sm px-2 py-0.5 rounded-full border bg-[var(--tag-bg,#f3f4f6)] text-[var(--tag-text,#111)]"
                                >
                  <span className="truncate max-w-[10rem]">{s}</span>
                  <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => removeTag(s, e)}
                      onKeyDown={(e) => e.key === "Enter" && removeTag(s, e)}
                      aria-label={`Quitar ${s}`}
                      className="ml-1 text-xs leading-none cursor-pointer"
                  >
                    ✕
                  </span>
                </span>
                            ))}
                        </div>
                    )}
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 7l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
                </div>

                {open && (
                    <div
                        role="listbox"
                        aria-multiselectable
                        className="absolute z-50 mt-2 w-full max-h-60 overflow-auto border rounded-md p-2 bg-[var(--dropdown-bg,white)] text-[var(--dropdown-text,#000)] border-[var(--dropdown-border,#d1d5db)] shadow-lg"
                    >
                        {ingredientsList.length === 0 ? (
                            <div className="p-2">No hay ingredientes</div>
                        ) : (
                            ingredientsList.map((ing) => {
                                const isChecked = selected.includes(ing.name);
                                return (
                                    <label
                                        key={ing.name}
                                        className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-[var(--dropdown-hover,#f3f4f6)]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleSelect(ing.name)}
                                            className="w-4 h-4"
                                        />
                                        <span className="truncate">{ing.name}</span>
                                    </label>
                                );
                            })
                        )}

                        <div className="mt-2 border-t pt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setSelected(ingredientsList.map((i) => i.name))}
                                className="px-2 py-1 rounded-md text-sm border"
                            >
                                Seleccionar todo
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelected([])}
                                className="px-2 py-1 rounded-md text-sm border"
                            >
                                Limpiar
                            </button>
                            <button type="button" onClick={() => setOpen(false)} className="ml-auto px-2 py-1 rounded-md text-sm border">
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <select
                name="duration"
                defaultValue={searchParams.get("duration") ?? ""}
                onChange={handleFilterChange}
                className="p-2 border rounded-md bg-[var(--select-bg,white)] text-[var(--select-text,#000)] border-[var(--select-border,#d1d5db)]"
            >
                <option value="">Cualquier duración</option>
                <option value="0-15">Menos de 15 min</option>
                <option value="15-30">15 - 30 min</option>
                <option value="30-60">30 - 60 min</option>
                <option value="60-">Más de 60 min</option>
            </select>
        </div>
    );
}