import { ActionCreator, AnyAction, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { API } from 'aws-amplify';

import {
  ICharacterCreate,
  ICharacterDelete,
  ICharacterEdit,
  ICharacter,
  ICharacterGetAllAction,
  ICharacterGetSingleAction,
  ICharacterLoading,
  ICharacterState,
  CharacterActionTypes
} from '../types/CharacterTypes';
import { async } from 'q';

const loading: ActionCreator<ICharacterLoading> = () => ({
  type: CharacterActionTypes.LOADING
});

export const getCharacters: ActionCreator<
  ThunkAction<Promise<AnyAction>, ICharacterState, null, ICharacterGetAllAction>
> = () => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());
    const response = await API.get('characters', '/characters', null);
    const characters = response.characters;
    return dispatch({
      characters,
      type: CharacterActionTypes.GETALL
    });
  };
};

export const getCharacter: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    ICharacterState,
    null,
    ICharacterGetSingleAction
  >
> = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());
    const response = await API.get('characters', `/characters/${id}`, null);
    const character = response;
    return dispatch({
      character,
      type: CharacterActionTypes.GETSINGLE
    });
  };
};
