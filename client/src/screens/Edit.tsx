import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import {Recipe} from '../models';
import { RecipeForm } from './components/RecipeForm';
import {useApiClient} from '../api/client';

export function Edit() {
    const match = useRouteMatch<{id: string}>();
    const history = useHistory();
    const apiClient = useApiClient();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const id = match.params.id;

    useEffect(() => {
        (async function () {
            setLoading(true);
            try {
                const data = await apiClient.getRecipe(id);
                setRecipe(data);
            } catch (error) {
                setError('could not load recipes: ' + error);
                setRecipe(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [apiClient, id]);

    async function handleSave(values: Recipe) {
        await apiClient.saveRecipe(values);
        history.push('/');
    }
    return (
        <>
            <Typography variant="h2" component="h1">Edit recipe</Typography>
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography>Could not load recipe</Typography>}
            {recipe && <RecipeForm recipe={recipe} onSave={handleSave} />}
        </>);
}