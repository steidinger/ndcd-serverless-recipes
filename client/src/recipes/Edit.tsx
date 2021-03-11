import { useHistory, useRouteMatch } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import {Recipe} from '../models';
import {useFetch} from '../useFetch';
import { RecipeForm } from './components/RecipeForm';

export function Edit() {
    const match = useRouteMatch<{id}>();
    const history = useHistory();
    const {data, loading, error} = useFetch<Recipe>('/api/recipes/' + match.params.id);
    async function handleSave(values) {
        await fetch(`/api/recipes/${match.params.id}`, {
            method: 'PUT',
            body: JSON.stringify(values),
        });
        history.push('/');
    }
    return (
        <>
            <Typography variant="h2" component="h1">Edit recipe</Typography>
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography>Could not load recipe</Typography>}
            {data && <RecipeForm recipe={data} onSave={handleSave} />}
        </>);
}