import * as uuid from 'uuid'
import * as createError from 'http-errors';

import { Recipe } from '../models';
import { SaveRecipeRequest } from '../requests/SaveRecipeRequest'
import { createLogger } from '../utils/logger'
import * as RecipeAccess from '../dataLayer/recipeAccess';
import {deleteImage, getImageUrl, getUploadUrl} from '../dataLayer/imageAccess';

const logger = createLogger("business-layer");

export async function create(recipe: SaveRecipeRequest, userId: string): Promise<Recipe> {
    const newRecipe: Recipe = {
        ...recipe,
        id: uuid.v4(),
        userId: userId,
        createdAt: new Date().toISOString(),
    }

    logger.info(`adding Recipe ${JSON.stringify(newRecipe)}`)
    return RecipeAccess.createRecipe(newRecipe);
}

export async function deleteRecipe(recipeId: string, userId: string): Promise<void> {
    const recipe = await RecipeAccess.loadRecipe(recipeId);
    if (!recipe) {
        logger.info(`Recipe with ID ${recipeId} not found`);
        throw new createError.NotFound(`Recipe with ID ${recipeId} not found`);
    }

    if (recipe.userId !== userId) {
        logger.info(`user ${userId} is not allowed to delete recipe created by ${recipe.userId}`);
        throw new createError.Forbidden();
    }
    logger.info(`deleting recipe with ID ${recipeId}, userId ${recipe.userId}, createdAt ${recipe.createdAt}`);
    await RecipeAccess.deleteRecipe(recipe);
    if (recipe.imageId) {
        logger.info(`deleting image ${recipe.imageId} for recipe ${recipeId}`);
        await deleteImage(recipe.imageId);
    }
    logger.info('deleted Recipe');
}

export async function addImage(recipeId: string, imageExtension: string, userId: string): Promise<string> {
    const recipe = await RecipeAccess.loadRecipe(recipeId);
    if (!recipe) {
        throw new createError.NotFound(`Recipe with ID ${recipeId} not found`);
    }
    if (recipe.userId !== userId) {
        logger.info(`user ${userId} is not allowed to add image to recipe created by ${recipe.userId}`);
        throw new createError.Forbidden(`user ${userId} is not allowed to add image to recipe created by ${recipe.userId}`);
    }

    const imageId = uuid.v4() + imageExtension;
    logger.debug(`get upload url for image ${imageId}, recipeId ${recipeId}`);
    const imageUrl = getImageUrl(imageId);
    logger.info(`updating recipe with image url for ${imageId}`)
    await RecipeAccess.addImage(recipe, imageUrl, imageId);

    logger.info(`creating signed URL`);
    return getUploadUrl(imageId);
}

export async function getAllRecipes(userId: string): Promise<Recipe[]> {
    return RecipeAccess.getAllRecipes(userId);
}

export async function getRecipe(recipeId: string, userId: string): Promise<Recipe> {
    const recipe = await RecipeAccess.loadRecipe(recipeId);
    if (recipe.userId !== userId) {
        logger.info(`user ${userId} is not allowed to access recipe created by ${recipe.userId}`);
        throw new createError.Forbidden();
    }
    return recipe;
}

export async function updateRecipe(recipeId: string, update: SaveRecipeRequest, userId: string) {
    const recipe = await RecipeAccess.loadRecipe(recipeId);
    if (!recipe) {
        logger.info(`Recipe with ID ${recipeId} not found`);
        throw new createError.NotFound(`Recipe with ID ${recipeId} not found`);
    }

    if (recipe.userId !== userId) {
        logger.info(`user ${userId} is not allowed to update recipe created by ${recipe.userId}`);
        throw new createError.Forbidden(`user ${userId} is not allowed to update recipe created by ${recipe.userId}`);
    }
    logger.info('Updating Recipe');
    return RecipeAccess.updateRecipe(recipe, update);
}