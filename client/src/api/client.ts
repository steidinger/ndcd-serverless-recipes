import {GetTokenSilentlyOptions, useAuth0} from '@auth0/auth0-react';
import {apiEndpoint} from '../config';
import { Recipe } from '../models';

type GetAllRecipesHandler = () => Promise<Recipe[]>;
type GetRecipeHandler = (id: string) => Promise<Recipe>;
type DeleteRecipeHandler = (id: string) => Promise<void>;
type SaveRecipeHandler = (recipe: Recipe) => Promise<void>;
type UploadImageHandler = (id: string, image: File, onProgress: (progress: string) => void) => Promise<void>;

export class ApiClient {
    private getAccessToken: (options?: GetTokenSilentlyOptions) => Promise<string>;

    set tokenAccessFunction(func: (options?: GetTokenSilentlyOptions) => Promise<string>) {
        this.getAccessToken = func;
    }

    createRecipe: SaveRecipeHandler = async (recipe: Recipe) => {
        const token = await this.getAccessToken();
        const response = await fetch(`${apiEndpoint}/recipes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'POST',
            body: JSON.stringify(recipe),
        });
        if (response.status !== 201) {
            throw new Error("Could not create recipe");
        }
    }

    saveRecipe: SaveRecipeHandler = async (recipe: Recipe) => {
        const token = await this.getAccessToken();
        const response = await fetch(`${apiEndpoint}/recipes/${recipe.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'PUT',
            body: JSON.stringify(recipe),
        });
        if (response.status !== 200) {
            throw new Error("Could not save recipe");
        }
    }
    
    deleteRecipe: DeleteRecipeHandler = async (id: string) => {
        const token = await this.getAccessToken();
        await fetch(`${apiEndpoint}/recipes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'DELETE',
        });
    }

    getAllRecipes: GetAllRecipesHandler = async () => {
        const token = await this.getAccessToken();
        const response = await fetch(`${apiEndpoint}/recipes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status !== 200) {
            throw new Error("Could not get list of recipes");
        }
        const {recipes} = await response.json();
        return recipes;
    }

    getRecipe: GetRecipeHandler = async (id) => {
        const token = await this.getAccessToken();
        const response = await fetch(`${apiEndpoint}/recipes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status !== 200) {
            throw new Error("Could not get recipe");
        }
        const json = await response.json();
        return json as Recipe;
    }

    uploadImage: UploadImageHandler = async (id, image, onProgress) => {
        onProgress('Uploading metadata');
        const token = await this.getAccessToken();
        const metaDataResponse = await fetch(`${apiEndpoint}/recipes/${id}/image`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ filename: image.name }),
        });
        if (metaDataResponse.status === 200) {
            const { uploadUrl } = await metaDataResponse.json();
            onProgress('Uploading image');
            await fetch(uploadUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': image.type,
                },
                method: 'PUT',
                body: image.stream(),
            });
            onProgress('');
        }
    }
}

const apiClient = new ApiClient();

export function useApiClient(): ApiClient {
    const {getAccessTokenSilently} = useAuth0();
    apiClient.tokenAccessFunction = getAccessTokenSilently;
    return apiClient;
}