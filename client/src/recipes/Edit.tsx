import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Toolbar, Typography } from '@material-ui/core';
import {Recipe} from '../models';
import {useFetch} from '../useFetch';

const useStyles = makeStyles((theme) => ({
    input: {
        width: '100%',
    },
    toolbar: {
        marginTop: theme.spacing(2),
    }
}));

interface EditProps {
    editMode: 'create' | 'edit',
}
export function Edit<EditProps>({editMode}) {
    const classes = useStyles();
    const history = useHistory();
    const match = useRouteMatch<{id}>();

    const {data, loading, error} = useFetch<Recipe>(editMode === 'edit' ? '/api/recipes/' + match.params.id : null);
    const recipe = data;
    if (loading) {
        return <div>Loading</div>;
    }
    if (error) {
        return <div>Could not load recipes</div>;
    }

    return (
        <>
            <Typography variant="h2" component="h1">{editMode === 'edit'? 'Edit recipe' : 'New recipe'}</Typography>
            <div>
                <TextField label="Title" value={recipe?.title} className={classes.input} />
            </div>
            <div>
                <TextField label="Description" value={recipe?.description} multiline className={classes.input} />
            </div>
            <Toolbar className={classes.toolbar}>
                <Button onClick={() => history.push('/')}>Cancel</Button>
                <Button color="primary" variant="contained" onClick={() => history.push('/')}>Save</Button>
            </Toolbar>
        </>);
}