import React from 'react';
import PropsRoute from './common/PropsRoute';
import Items from './modules/items/Items';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
  Redirect
} from 'react-router-dom';
import Header from './common/Header';
import ItemPage from './modules/items/ItemPage';
import NotFound from './modules/notFound/NotFound';
import AddItem from './modules/items/AddItem';

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
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default RoutesWrap;
