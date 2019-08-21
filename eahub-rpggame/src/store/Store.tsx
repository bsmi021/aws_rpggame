import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ICharacterState } from '../types/CharacterTypes';
import { charactersReducer } from '../reducers/CharactersReducer';
import { IItemsState } from '../types/ItemTypes';
import { itemsReducer } from '../reducers/ItemsReducer';
import { authReducer } from '../reducers/AuthReducer';
import { IAuthState } from '../types/AuthTypes';
import { IFightState } from '../types/FightTypes';
import { fightsReducer } from '../reducers/FightReducer';
import { saveState, loadState } from './localStorage';
import _ from 'lodash';
import { IEnemyState } from '../types/EnemyTypes';
import { enemiesReducer } from '../reducers/EnemyReducer';

const persistedState = loadState();

export interface IApplicationState {
  characters: ICharacterState;
  items: IItemsState;
  auth: IAuthState;
  fights: IFightState;
  enemies: IEnemyState;
}

const rootReducer = combineReducers<IApplicationState>({
  characters: charactersReducer,
  items: itemsReducer,
  auth: authReducer,
  fights: fightsReducer,
  enemies: enemiesReducer
});

// configure the store and return it
export default function configureStore(): Store<IApplicationState> {
  const store = createStore(
    rootReducer,
    persistedState,
    composeWithDevTools(applyMiddleware(thunk))
  );
  store.subscribe(
    _.throttle(() => {
      saveState({
        auth: store.getState().auth,
        characters: store.getState().characters,
        items: store.getState().items,
        fights: store.getState().fights,
        enemies: store.getState().enemies
      });
    }, 1000)
  );
  return store;
}
