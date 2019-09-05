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
//import FightPage from '../fights/FightPage';
import ItemForm from '../items/ItemForm';
import WSFight from '../fights/WSFight';
import WSFightPage from '../fights/WSFightPage';
import Footer from '../footer/Footer';
import { Container, Grid } from 'semantic-ui-react';

const RoutesWrap: React.FunctionComponent = () => {
  return (
    <Router>
      <Route component={Routes} />
    </Router>
  );
};

const Routes: React.FunctionComponent<RouteComponentProps> = props => {
  return (
    <Grid
      container={true}
      style={{
        height: '100vh',
        maxHeight: '100vh',
        position: 'relative',
        margin: '0',
        padding: '0'
      }}
    >
      <Grid.Row style={{ padding: 0, margin: 0 }}>
        <Grid.Column style={{ padding: 0, margin: 0 }}>
          <Header />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row
        style={{
          padding: 0,
          overflow: 'auto',
          margin: 0,
          height: '50rem',
          maxHeight: '50rem',
          background: '#dae1e7'
        }}
      >
        <Grid.Column style={{ overflow: 'auto', padding: '0', margin: '0' }}>
          <Switch key={props.location.key} location={props.location}>
            <Redirect exact={true} from="/" to="/home" />
            <Route exact={true} path="/home" component={Home} />
            <Route exact={true} path="/characters" component={CharactersPage} />
            <Route
              exact={true}
              path="/characters/new"
              component={CharacterForm}
            />
            <Route
              exact={true}
              path="/characters/:id"
              component={CharacterPage}
            />

            <Route exact={true} path="/items/:id" component={ItemPage} />
            <Route exact={true} path="/fight" component={WSFightPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ padding: 0, margin: 0 }}>
        <Grid.Column style={{ padding: 0, margin: 0 }}>
          <Footer />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default RoutesWrap;

/*

      </Container>


      <TransitionGroup>
        <CSSTransition
          key={props.location.key}
          timeout={500}
          className="animate"
        >

                </CSSTransition>
      </TransitionGroup> 
      */
