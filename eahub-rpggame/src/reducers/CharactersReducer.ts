import { Reducer } from 'redux';
import {
  CharacterActionTypes,
  CharacterActions,
  ICharacterState
} from '../types/CharacterTypes';

const initialCharacterState: ICharacterState = {
  characters: [],
  charactersLoading: false,
  currentCharacter: null,
  defaultCharacter: null
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
    case CharacterActionTypes.SETDEFAULT: {
      return {
        ...state,
        defaultCharacter: action.character,
        charactersLoading: false
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
    case CharacterActionTypes.EQUIPITEM || CharacterActionTypes.UNEQUIPITEM: {
      return {
        ...state,
        currentCharacter: action.character,
        defaultCharacter: action.character,
        charactersLoading: false
      };
    }
    default:
      return state;
  }
};
