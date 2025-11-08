"use client";

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

    return (
        <div className="mb-8 flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-[var(--background-50)]">
            <input
                type="search"
                placeholder="Buscar por nombre..."
                defaultValue={searchParams.get('q')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-grow p-2 border rounded-md bg-transparent"
            />
            <select
                name="ingredients"
                defaultValue={searchParams.get('ingredients')?.toString()}
                onChange={handleFilterChange}
                className="p-2 border rounded-md bg-transparent"
            >
                <option value="">Todos los ingredientes</option>
                {ingredientsList.map(ing => (
                    <option key={ing.name} value={ing.name}>{ing.name}</option>
                ))}
            </select>
            <select
                name="duration"
                defaultValue={searchParams.get('duration')?.toString()}
                onChange={handleFilterChange}
                className="p-2 border rounded-md bg-transparent"
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