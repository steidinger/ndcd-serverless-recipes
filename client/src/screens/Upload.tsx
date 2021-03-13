import { useHistory, useRouteMatch } from 'react-router-dom';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Toolbar, Typography } from '@material-ui/core';

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
    const [upload, setUpload] = useState(null);
    const [progress, setProgress] = useState('');

    async function handleUpload() {
        if (upload) {
            setProgress('Uploading metadata');
            const metaDataResponse = await fetch(`/api/recipes/${match.params.id}/image`, {
                headers: {
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ filename: upload.name }),
            });
            if (metaDataResponse.status === 200) {
                const { uploadUrl } = await metaDataResponse.json();
                setProgress('Uploading image');
                await fetch(uploadUrl, {
                    headers: {
                        'content-type': upload.type,
                    },
                    method: 'PUT',
                    body: upload.stream(),
                });
                setProgress('');
                history.push(`/${match.params.id}`);
            }
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