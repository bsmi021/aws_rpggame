import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
  Redirect
} from 'react-router-dom';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import NotFoundPage from '../notFound/NotFoundPage';
import Home from '../home/Home';
import Header from '../header/Header';
import CharactersPage from '../characters/CharactersPage';
import ItemsPage from '../items/ItemsPage';
import ItemPage from '../items/ItemPage';
import CharacterPage from '../characters/CharacterPage';
import CharacterForm from '../characters/CharacterForm';
import FightPage from '../fights/FightPage';

const RoutesWrap: React.FunctionComponent = () => {
  return (
    <Router>
      <Route component={Routes} />
    </Router>
  );
};

const Routes: React.FunctionComponent<RouteComponentProps> = props => {
  return (
    <div className="ui middle aligned center inverted container">
      <Header />

      <Switch key={props.location.key} location={props.location}>
        <Redirect exact={true} from="/" to="/home" />
        <Route exact={true} path="/home" component={Home} />
        <Route exact={true} path="/characters" component={CharactersPage} />
        <Route exact={true} path="/characters/new" component={CharacterForm} />
        <Route exact={true} path="/characters/:id" component={CharacterPage} />
        <Route exact={true} path="/items" component={ItemsPage} />
        <Route exact={true} path="/items/:id" component={ItemPage} />
        <Route exact={true} path="/fights/:id" component={FightPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
};

export default RoutesWrap;

/*
      <TransitionGroup>
        <CSSTransition
          key={props.location.key}
          timeout={500}
          className="animate"
        >

                </CSSTransition>
      </TransitionGroup> 
      */
