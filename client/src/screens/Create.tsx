import {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import {Recipe} from '../models';
import { RecipeForm } from './components/RecipeForm';
import {useApiClient} from '../api/client';

export function Create() {
    const recipe = {title: '', description: ''} as Recipe;
    const history = useHistory();
    const apiClient = useApiClient();
    const [error, setError] = useState('');

    async function handleSave(values: Recipe) {
        setError('');
        try {
            await apiClient.createRecipe(values);
            history.push('/');
        } catch (e) {
            setError(e.message ?? e.toString())
        }
    }
    return (
        <>
            <Typography variant="h2" component="h1">Create recipe</Typography>
            {error !== '' && <Typography style={{color: 'red'}}>{error}</Typography>}
            <RecipeForm recipe={recipe} onSave={handleSave} />
        </>);
}