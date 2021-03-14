import { useHistory, useRouteMatch } from 'react-router-dom';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Typography } from '@material-ui/core';
import {useApiClient} from '../api/client';

const useStyles = makeStyles((theme) => ({
    root: {
    },
    uploadLabel: {
        display: 'block',
        marginTop: theme.spacing(2),
    }
}));

export function Upload() {
    const classes = useStyles();
    const history = useHistory();
    const match = useRouteMatch<{ id: string }>();
    const apiClient = useApiClient();
    const [upload, setUpload] = useState(null);
    const [progress, setProgress] = useState('');

    async function handleUpload() {
        if (upload) {
            await apiClient.uploadImage(match.params.id, upload, setProgress);
            history.push(`/${match.params.id}`);
        }
    }

    return (
        <div className={classes.root}>
            <Typography variant="h4" component="h1">Upload picture</Typography>
            <form>
                <div className="form-control">
                    <label htmlFor="upload" className={classes.uploadLabel}>Choose picture</label>
                    <input 
                        id="upload" 
                        name="upload" 
                        type="file" 
                        accept="image/*"
                        onChange={(event) => setUpload(event.target.files[0])}
                    />
                </div>
            </form>
            {progress && <Typography variant="body1">{progress}</Typography>}
            <Toolbar>
                <Button disabled={progress !== ''} onClick={() => history.goBack()}>Cancel</Button>
                <Button color="primary" variant="contained" disabled={!upload || progress !== ''} onClick={handleUpload}>Upload</Button>
            </Toolbar>
        </div>
    )
}