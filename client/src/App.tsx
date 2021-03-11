import { AppBar, Button, Container, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Edit } from './recipes/Edit';
import { Details } from './recipes/Details';
import { List } from './recipes/List';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>Recipes</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Router>
          <Switch>
            <Route path="/new-recipe"><Edit editMode="create" /></Route>
            <Route path="/:id/edit"><Edit editMode="edit" /></Route>
            <Route path="/:id"><Details /></Route>
            <Route path="/"><List /></Route>
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default App;
