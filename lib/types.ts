export interface Ingredient {
    name: string;
}

export interface RecipeIngredient {
    quantity: string;
    ingredients: Ingredient;
}

export interface Recipe {
    id: number;
    title: string;
    description: string;
    instructions: string;
    image_url: string;
    prep_time_minutes: number;
    cook_time_minutes: number;
    servings: number;
    is_public: boolean;
    created_at: string;
}

export interface RecipeWithIngredients extends Recipe {
    recipe_ingredients: RecipeIngredient[];
}