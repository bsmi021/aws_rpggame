import { CharacterActionTypes, ItemActionTypes } from "./types";
import history from "../history";
import { ActionCreator, AnyAction, Dispatch } from "redux";
import characterAPI from "../apis/characterAPI";
import { async } from "q";
import { ICharacter } from "../modules/characters/CharacterType";

export const fetchCharacters = () => async (dispatch: Dispatch) => {
  const response = await characterAPI.get("characters");

  dispatch({
    type: CharacterActionTypes.FETCH_ALL,
    payload: response.data.characters ? response.data.charaters : response.data
  });
};

export const fetchCharacter = (id: string) => async (dispatch: Dispatch) => {
  const response = await characterAPI.get(`characters/${id}`);

  dispatch({
    type: CharacterActionTypes.FETCH_ONE,
    payload: response.data
  });
};

export const createCharacter = (formValues: ICharacter) => async (
  dispatch: Dispatch,
  getState: any
) => {
  const { userId } = getState().auth;

  const response = await characterAPI.post("/characters", {
    ...formValues,
    userId
  });

  dispatch({ type: CharacterActionTypes.CREATE, payload: response.data });

  history.push("/characters");
};

export const deleteCharactyer = (characterId: string) => async (
  dispatch: Dispatch
) => {
  const response = await characterAPI.delete(`/characters/${characterId}`);

  dispatch({ type: CharacterActionTypes.DELETE });

  history.push("/characters");
};
