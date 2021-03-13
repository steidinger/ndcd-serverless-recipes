import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Container, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Create } from './screens/Create';
import { Edit } from './screens/Edit';
import { Details } from './screens/Details';
import { List } from './screens/List';
import { Upload } from './screens/Upload';

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

function App() {
  const classes = useStyles();

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" component={RouterLink} to="/">
            <MenuIcon />
          </IconButton>          
          <Typography variant="h6" className={classes.title}>Recipes</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <>
          <Switch>
            <Route path="/new-recipe"><Create /></Route>
            <Route path="/:id/edit"><Edit /></Route>
            <Route path="/:id/upload"><Upload /></Route>
            <Route path="/:id"><Details /></Route>
            <Route path="/"><List /></Route>
          </Switch>
        </>
      </Container>
    </Router>
  );
}

export default App;
