import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import {Recipe} from '../models';
import { RecipeForm } from './components/RecipeForm';
import {useApiClient} from '../api/client';

export function Create() {
    const recipe = {title: '', description: ''} as Recipe;
    const history = useHistory();
    const apiClient = useApiClient();

    async function handleSave(values: Recipe) {
        await apiClient.createRecipe(values);
        history.push('/');
    }
    return (
        <>
            <Typography variant="h2" component="h1">Create recipe</Typography>
            <RecipeForm recipe={recipe} onSave={handleSave} />
        </>);
}