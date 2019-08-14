import { ICharacter } from "../../modules/characters/CharacterType";
export interface CharacterState {
  characters: ICharacter[];
}

export enum CharacterActionTypes {
  FETCH_ALL = "CUSTOMERS/FETCH_ALL",
  FETCH_ONE = "CUSTOMERS/FETCH_ONE",
  CREATE = "CUSTOMERS/CREATE",
  EDIT = "CUSTOMERS/EDIT",
  DELETE = "CUSTOEMRS/DELETE"
}

interface FetchCharactersAction {
  type: CharacterActionTypes.FETCH_ALL;
  payload: ICharacter[];
}

interface FetchCharacterAction {
  type: CharacterActionTypes.FETCH_ONE;
  payload: ICharacter[];
}

export type CharacterActions = FetchCharacterAction | FetchCharactersAction;
