import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ICharacterState } from '../types/CharacterTypes';
import { charactersReducer } from '../reducers/CharactersReducer';
import { IItemsState } from '../types/ItemTypes';
import { itemsReducer } from '../reducers/ItemsReducer';
import { authReducer } from '../reducers/AuthReducer';
import { IAuthState } from '../types/AuthTypes';

export interface IApplicationState {
  characters: ICharacterState;
  items: IItemsState;
  auth: IAuthState;
}

const rootReducer = combineReducers<IApplicationState>({
  characters: charactersReducer,
  items: itemsReducer,
  auth: authReducer
});

// configure the store and return it
export default function configureStore(): Store<IApplicationState> {
  const store = createStore(
    rootReducer,
    undefined,
    composeWithDevTools(applyMiddleware(thunk))
  );
  return store;
}
