import {useFormik} from 'formik';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Toolbar } from '@material-ui/core';
import {Recipe} from '../../models';

const useStyles = makeStyles((theme) => ({
    input: {
        width: '100%',
    },
    toolbar: {
        marginTop: theme.spacing(2),
    }
}));

interface RecipeFormProps {
    recipe?: Recipe,
    onSave?: (recipe: Recipe) => void,
}

export function RecipeForm({recipe, onSave}: RecipeFormProps) {
    const classes = useStyles();
    const history = useHistory();
    const formik = useFormik({
        initialValues: recipe,
        onSubmit: (values) => {
            console.log('Submit', values);
            onSave(values);
        },
    });
    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <TextField 
                    name="title" 
                    label="Title" 
                    value={formik.values.title} 
                    className={classes.input} 
                    onChange={formik.handleChange}
                />
            </div>
            <div>
                <TextField 
                    name="description"
                    label="Description" 
                    value={formik.values.description} 
                    multiline 
                    className={classes.input} 
                    onChange={formik.handleChange}
                />
            </div>
            <Toolbar className={classes.toolbar}>
                <Button onClick={() => history.push('/')}>Cancel</Button>
                <Button color="primary" variant="contained" type="submit">Save</Button>
            </Toolbar>
        </form>
    )
}
