import { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardMedia, IconButton, Toolbar, Typography } from '@material-ui/core';
import UploadIcon from '@material-ui/icons/Edit';
import {Recipe} from '../models';
import {useApiClient} from '../api/client';

import placeholder from '../assets/placeholder.png';

const useStyles = makeStyles((theme) => ({
    imagePanel: {
        width: '20vh',
    },
    image: {
        height: '30vh',
        width: '20vh',
    },
    toolbar: {
        marginTop: theme.spacing(2),
        paddingLeft: 0,
        paddingRight: 0,
        justifyContent: 'space-between',
    }
}));

export function Details() {
    const classes = useStyles();
    const history = useHistory();
    const match = useRouteMatch<{id: string}>();
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

    async function handleDelete() {
        if (window.confirm('Delete recipe?')) {
            await apiClient.deleteRecipe(id);
            history.push('/');
        }
    }
    if (loading) {
        return <div>Loading</div>;
    }
    if (error) {
        return <div>Could not load recipe</div>;
    }
    if (!recipe) {
        return <div />
    }
    return (
        <>
            <Typography variant="h2" component="h1">{recipe.title}</Typography>
            <Card className={classes.imagePanel} variant="outlined">
                <CardMedia className={classes.image} image={recipe.imageUrl ?? placeholder} />
                <CardActions>
                    <IconButton aria-label="Upload image" size="small" onClick={() => history.push(`/${recipe.id}/upload`)}>
                        <UploadIcon />
                    </IconButton>
                </CardActions>
            </Card>
            <Typography>{recipe.description}</Typography>
            <Toolbar className={classes.toolbar}>
                <Button onClick={handleDelete}>Delete</Button>
                <Button onClick={() => history.push('/')}>Close</Button>
                <Button onClick={() => history.push(`/${recipe.id}/edit`)}>Edit</Button>
            </Toolbar>
        </>);
}