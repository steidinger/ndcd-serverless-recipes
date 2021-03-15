export interface Recipe {
    id?: string,
    userId: string,
    title: string,
    description: string,
    createdAt: string,
    imageId?: string,
    imageUrl?: string,
}

export interface RecipeUpdate {
    title: string,
    description: string,
}