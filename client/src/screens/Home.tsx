import {useAuth0} from '@auth0/auth0-react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Container, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route } from "react-router-dom";
import { Create } from './Create';
import { Edit } from './Edit';
import { Details } from './Details';
import { List } from './List';
import { Upload } from './Upload';
import { UserInfo } from './components/UserInfo';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
    },
}));

export function Home() {
    const classes = useStyles();
    const {isAuthenticated, isLoading} = useAuth0();

    return (<>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={RouterLink} to="/">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>Recipes</Typography>
                <UserInfo />
            </Toolbar>
        </AppBar>
        <Container fixed>
            {isAuthenticated && 
                <Switch>
                    <Route path="/new-recipe"><Create /></Route>
                    <Route path="/:id/edit"><Edit /></Route>
                    <Route path="/:id/upload"><Upload /></Route>
                    <Route path="/:id"><Details /></Route>
                    <Route path="/"><List /></Route>
                </Switch>
            }
            {!isAuthenticated && !isLoading &&
                <Typography>Please login to use the application</Typography>
            }
        </Container>
    </>
    )
}