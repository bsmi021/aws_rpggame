import { ActionCreator, AnyAction, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { API } from 'aws-amplify';

import {
  ICharacterCreate,
  ICharacter,
  ICharacterGetAllAction,
  ICharacterGetSingleAction,
  ICharacterLoading,
  ICharacterState,
  ICharacterSetDefault,
  CharacterActionTypes,
  ICharacterEquipItem,
  ICharacterUnequipItem
} from '../types/CharacterTypes';
import { IApplicationState } from '../store/Store';

const loading: ActionCreator<ICharacterLoading> = () => ({
  type: CharacterActionTypes.LOADING
});

export const setDefaultCharacter: ActionCreator<
  ThunkAction<Promise<AnyAction>, ICharacterState, null, ICharacterSetDefault>
> = (character: ICharacter) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());

    return dispatch({
      type: CharacterActionTypes.SETDEFAULT,
      character
    });
  };
};

export const getCharacters: ActionCreator<
  ThunkAction<Promise<AnyAction>, ICharacterState, null, ICharacterGetAllAction>
> = () => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());
    const response = await API.get('charsaggr', '/characters', null);
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
    const response = await API.get('charsaggr', `/characters/${id}`, null);
    const character = response;
    return dispatch({
      character,
      type: CharacterActionTypes.GETSINGLE
    });
  };
};

export const equipItem: ActionCreator<
  ThunkAction<Promise<AnyAction>, ICharacterState, null, ICharacterEquipItem>
> = (charId: string, itemId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());
    const response = await API.put(
      'charsaggr',
      `/characters/${charId}/equip_item`,
      { body: { id: itemId } }
    );
    return dispatch({
      type: CharacterActionTypes.EQUIPITEM,
      character: response
    });
  };
};

export const unequipItem: ActionCreator<
  ThunkAction<Promise<AnyAction>, ICharacterState, null, ICharacterUnequipItem>
> = (charId: string, itemId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());
    const response = await API.put(
      'charsaggr',
      `/characters/${charId}/unequip_item`,
      { body: { id: itemId } }
    );
    return dispatch({
      type: CharacterActionTypes.UNEQUIPITEM,
      character: response
    });
  };
};

export const createCharacter: ActionCreator<
  ThunkAction<Promise<AnyAction>, IApplicationState, null, ICharacterCreate>
> = (characterName: string, characterClass: number) => {
  return async (dispatch: Dispatch, getState) => {
    dispatch(loading());
    const userId = getState().auth.userId || '';

    const request = {
      body: {
        name: characterName,
        account: userId,
        player_class: characterClass
      }
    };

    const response = await API.post('characters', 'characters', request).catch(
      e => alert('An error occurred when trying to save this new character.')
    );

    return dispatch({
      type: CharacterActionTypes.CREATE,
      character: response
    });
  };
};
