import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import {Recipe} from '../models';
import { RecipeForm } from './components/RecipeForm';

export function Create() {
    const recipe = {title: '', description: ''} as Recipe;
    const history = useHistory();
    async function handleSave(values: Recipe) {
        await fetch('/api/recipes', {
            method: 'POST',
            body: JSON.stringify(values),
        });
        history.push('/');
    }
    return (
        <>
            <Typography variant="h2" component="h1">Create recipe</Typography>
            <RecipeForm recipe={recipe} onSave={handleSave} />
        </>);
}