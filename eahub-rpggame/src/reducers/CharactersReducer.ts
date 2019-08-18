import { Reducer } from 'redux';
import {
  CharacterActionTypes,
  CharacterActions,
  ICharacterState
} from '../types/CharacterTypes';

const initialCharacterState: ICharacterState = {
  characters: [],
  charactersLoading: false,
  currentCharacter: null
};

export const charactersReducer: Reducer<ICharacterState, CharacterActions> = (
  state = initialCharacterState,
  action
) => {
  switch (action.type) {
    case CharacterActionTypes.LOADING: {
      return {
        ...state,
        charactersLoading: true
      };
    }
    case CharacterActionTypes.GETALL: {
      return {
        ...state,
        characters: action.characters,
        charactersLoading: false
      };
    }
    case CharacterActionTypes.GETSINGLE: {
      return {
        ...state,
        currentCharacter: action.character,
        charactersLoading: false
      };
    }
    default:
      return state;
  }
};
