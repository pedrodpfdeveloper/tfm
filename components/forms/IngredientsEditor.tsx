"use client";

import React, { useState } from "react";

interface IngredientItem {
  id: string;
  name: string;
  quantity: string;
}

interface IngredientsEditorProps {
  existingIngredients: string[];
  initialItems?: { name: string; quantity: string }[];
}

export default function IngredientsEditor({
  existingIngredients,
  initialItems,
}: IngredientsEditorProps) {
  const [items, setItems] = useState<IngredientItem[]>(() => {
    if (initialItems && initialItems.length > 0) {
      return initialItems.map((item, index) => ({
        id: String(index + 1),
        name: item.name,
        quantity: item.quantity,
      }));
    }
    return [
      {
        id: "1",
        name: "",
        quantity: "",
      },
    ];
  });

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: "",
        quantity: "",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (next.length === 0) {
        return [
          {
            id: String(Date.now()),
            name: "",
            quantity: "",
          },
        ];
      }
      return next;
    });
  };

  const updateItem = (id: string, field: "name" | "quantity", value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">Ingredientes</h2>
        <p className="text-sm text-gray-500">
          Añade los ingredientes de la receta, puedes reutilizar los ya existentes o escribir nuevos.
        </p>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-6">
              <label className="block text-xs mb-1">Ingrediente</label>
              <input
                type="text"
                name="ingredient_name"
                list="ingredients-list"
                className="w-full border rounded-md p-2 text-sm"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                placeholder="Ej. Tomate"
              />
            </div>
            <div className="col-span-5">
              <label className="block text-xs mb-1">Cantidad</label>
              <input
                type="text"
                name="ingredient_quantity"
                className="w-full border rounded-md p-2 text-sm"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                placeholder="Ej. 2 unidades, 100 g..."
              />
            </div>
            <div className="col-span-1 flex items-center justify-end mb-1.5">
              <button
                type="button"
                onClick={() => removeRow(item.id)}
                className="text-xs px-2 py-1 border rounded-md text-red-600 border-red-200 hover:bg-red-50"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      <datalist id="ingredients-list">
        {existingIngredients.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <button
        type="button"
        onClick={addRow}
        className="text-sm px-3 py-1 border rounded-md border-gray-300 hover:bg-gray-50"
      >
        Añadir ingrediente
      </button>
    </div>
  );
}
