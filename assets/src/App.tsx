import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Router, Route, Switch } from 'react-router-dom';
import  Header  from './common/Header';
import history from './history';
import Home from './common/Home';
import ItemsList from './modules/items/ItemsList';
import AddItem from './modules/items/AddItem';
import ItemPage from './modules/items/ItemPage';
import CharacterList from './modules/characters/CharacterList';
import CharacterPage from './modules/characters/CharacterPage';
import NotFound from './modules/notFound/NotFound';

const App: React.FC = () => {
  return (
    <div className="ui container inverted">
      <Router history={history}>
        <Header/>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/home" exact component={Home} />
          <Route path="/items" exact component={ItemsList} />
          <Route path="/items/new" exact component={AddItem} />
          <Route path="/items/:id" exact component={ItemPage} />

          <Route path="/characters" exact component={CharacterList} />
          <Route path="/characters/:id" exact component={CharacterPage} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
