import React from 'react';
import Items from './modules/items/Items';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch
} from 'react-router-dom';
import Header from './common/Header';
import ItemPage from './modules/items/ItemPage';
import NotFound from './modules/notFound/NotFound';
import AddItem from './modules/items/AddItem';
import CharacterList from './modules/characters/CharacterList';
import CharacterPage from './modules/characters/CharacterPage';
import { Container } from 'react-bootstrap';

const RoutesWrap: React.SFC = () => {
  return (
    <Router>
      <Route component={Routes} />
    </Router>
  );
};

interface RouteProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (authenticated: boolean) => void;
}

export const Routes: React.SFC<RouteComponentProps> = props => {
  const [loggedIn, setLoggedIn] = React.useState(true);
  document.title = 'SASCraft Demo';
  return (
    <div>
      <Header />
      <Switch>
        <Route path="/items" exact component={Items} />
        <Route path="/items/:id" exact component={ItemPage} />
        <Route path="/add_item" exact component={AddItem} />
        <Route path="/characters" exact component={CharacterList} />
        <Route path="/characters/:id" exact component={CharacterPage} />
        <Route component={NotFound} />
      </Switch>
      <Container />
    </div>
  );
};

export default RoutesWrap;
