import { ActionCreator, AnyAction, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { API } from 'aws-amplify';

import {
  ICharacterCreateAction,
  ICharacter,
  ICharacterGetAllAction,
  ICharacterGetSingleAction,
  ICharacterLoadingAction,
  ICharacterState,
  ICharacterSetDefaultAction,
  CharacterActionTypes,
  ICharacterEquipItemAction,
  ICharacterUnequipItemAction,
  ICharacterAddItemAction,
  ICharacterRemoveItemAction
} from '../types/CharacterTypes';
import { IApplicationState } from '../store/Store';

const loading: ActionCreator<ICharacterLoadingAction> = () => ({
  type: CharacterActionTypes.LOADING
});

export const setDefaultCharacter: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    ICharacterState,
    null,
    ICharacterSetDefaultAction
  >
> = (character: ICharacter) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());

    const response = await API.get(
      'charsaggr',
      `/characters/${character.id}`,
      null
    );

    return dispatch({
      type: CharacterActionTypes.SETDEFAULT,
      character: response
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

export const addItem: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    ICharacterState,
    null,
    ICharacterAddItemAction
  >
> = (charId: string, invId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());

    try {
      const response = await API.put(
        'charsaggr',
        `/characters/${charId}/add_item`,
        { body: { itemId: invId } }
      );
      return dispatch({
        type: CharacterActionTypes.EQUIPITEM,
        character: response
      });
    } catch (error) {
      alert('There was a problem equipping');
      return dispatch({
        type: CharacterActionTypes.ERROR,
        error
      });
    }
  };
};

export const equipItem: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    ICharacterState,
    null,
    ICharacterEquipItemAction
  >
> = (charId: string, invId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());

    try {
      await API.put('charsaggr', `/characters/${charId}/equip_item`, {
        body: { inv_id: invId }
      });

      const character = await API.get(
        'charsaggr',
        `/characters/${charId}`,
        null
      );

      return dispatch({
        type: CharacterActionTypes.EQUIPITEM,
        character
      });
    } catch (error) {
      alert('There was a problem equipping');
      return dispatch({
        type: CharacterActionTypes.ERROR,
        error
      });
    }
  };
};

export const unequipItem: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    ICharacterState,
    null,
    ICharacterUnequipItemAction
  >
> = (charId: string, invId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());

    try {
      await API.put('charsaggr', `/characters/${charId}/unequip_item`, {
        body: { inv_id: invId }
      });

      const character = await API.get(
        'charsaggr',
        `/characters/${charId}`,
        null
      );

      return dispatch({
        type: CharacterActionTypes.UNEQUIPITEM,
        character
      });
    } catch (error) {
      alert('There was an error equipping this item');
      return dispatch({
        type: CharacterActionTypes.ERROR,
        error
      });
    }
  };
};

export const createCharacter: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IApplicationState,
    null,
    ICharacterCreateAction
  >
> = (characterName: string, characterClass: number) => {
  return async (dispatch: Dispatch, getState) => {
    dispatch(loading());
    try {
      const userId = getState().auth.userId || '';

      const request = {
        body: {
          name: characterName,
          account: userId,
          player_class: characterClass
        }
      };

      const response = await API.post('charsaggr', 'characters', request);

      return dispatch({
        type: CharacterActionTypes.CREATE,
        character: response
      });
    } catch (error) {
      alert(error);
      alert('There was a problem saving this character');
      return dispatch({
        type: CharacterActionTypes.ERROR,
        message: error
      });
    }
  };
};

export const removeItem: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    ICharacterState,
    null,
    ICharacterRemoveItemAction
  >
> = (charId: string, invId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());

    try {
      await API.put('charsaggr', `/characters/${charId}/remove_item`, {
        body: { inv_id: invId }
      });

      const character = await API.get(
        'charsaggr',
        `/characters/${charId}`,
        null
      );
      return dispatch({
        type: CharacterActionTypes.REMOVEITEM,
        character
      });
    } catch (error) {
      alert('There was a problem removing this item');
      return dispatch({
        type: CharacterActionTypes.ERROR,
        error
      });
    }
  };
};
