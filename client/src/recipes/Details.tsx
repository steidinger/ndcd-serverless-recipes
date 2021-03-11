import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, CardActions, CardMedia, IconButton, Toolbar, Typography } from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUpload';
import {Recipe} from '../models';
import {useFetch} from '../useFetch';
import placeholder from '../assets/placeholder.png';

const useStyles = makeStyles((theme) => ({
    imagePanel: {
        width: '20vh',

    },
    image: {
        height: '30vh',
        widht: '20vh',
    },
    imageButton: {
    },
    toolbar: {
        marginTop: theme.spacing(2),
    }
}));

export function Details() {
    const classes = useStyles();
    const history = useHistory();
    const match = useRouteMatch<{id: string}>();
    const {data, loading, error} = useFetch<Recipe>(match.params.id ? '/api/recipes/' + match.params.id : null);
    const recipe = data;
    async function handleDelete() {
        if (window.confirm('Delete recipe?')) {
            await fetch(`/api/recipes/${match.params.id}`, {method: 'DELETE'});
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
                <IconButton className={classes.imageButton} size="small"><UploadIcon /></IconButton>
                </CardActions>
            </Card>
            <Typography>{recipe.description}</Typography>
            <Toolbar className={classes.toolbar}>
                <Button onClick={() => history.push(`/${recipe.id}/edit`)}>Edit</Button>
                <Button onClick={handleDelete}>Delete</Button>
            </Toolbar>
        </>);
}