import { useEffect, useState } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Fab, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import placeholder from '../assets/placeholder.png';
import { Recipe } from '../models';
import { useApiClient } from '../api/client';

const useStyles = makeStyles((theme) => ({
    card: {
        marginTop: theme.spacing(4),
    },
    actionArea: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    image: {
        width: 200,
        minWidth: 150,
        height: 250,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: '1 1 auto',
    },
    description: {

    },
    actions: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(4),
    },
}));

export function List() {
    const history = useHistory();
    const classes = useStyles();
    const apiClient = useApiClient();
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async function () {
            setLoading(true);
            try {
                const data = await apiClient.getAllRecipes();
                setRecipes(data);
            } catch (error) {
                setError('could not load recipes: ' + error);
                setRecipes(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [apiClient]);

    if (loading) {
        return <div>Loading</div>;
    }
    if (error) {
        return <div>Could not load recipes</div>;
    }
    return (
        <>
            {recipes !== null && recipes.map(({ id, title, description, imageUrl }) =>
                <Card key={id} className={classes.card}>
                    <CardActionArea className={classes.actionArea} onClick={() => history.push(`/${id}`)}>
                        <CardMedia className={classes.image} image={imageUrl ?? placeholder} />
                        <CardContent className={classes.content}>
                            <section className={classes.description}>
                                <Typography gutterBottom variant="h5">{title}</Typography>
                                <Typography>{description}</Typography>
                            </section>
                            <div className={classes.actions}>
                                <Link to={`/${id}`} component={RouterLink} variant="body2">Details</Link>
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            )}
            <Fab color="primary" className={classes.fab} onClick={() => history.push('/new-recipe')}><AddIcon /></Fab>
        </>
    );
}