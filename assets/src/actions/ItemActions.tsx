import { ItemActionTypes } from "./types";
import history from "../history";
import { ActionCreator, AnyAction, Dispatch } from "redux";
import itemsAPI from "../apis/itemsAPI";
import { async } from "q";
import { IItem } from "../modules/items/ItemType";

export const fetchItems = () => async (dispatch: Dispatch) => {
  const response = await itemsAPI.get("items");

  dispatch({
    type: ItemActionTypes.FETCH_ALL,
    payload: response.data.items ? response.data.items : response.data
  });
};

export const fetchItem = (id: string) => async (dispatch: Dispatch) => {
  const response = await itemsAPI.get(`items/${id}`);

  dispatch({
    type: ItemActionTypes.FETCH_ONE,
    payload: response.data
  });
};

export const createItem = (formValues: IItem) => async (
  dispatch: Dispatch,
  getState: any
) => {
  const { userId } = getState().auth;

  const response = await itemsAPI.post("/items", {
    ...formValues,
    userId
  });

  dispatch({
    type: ItemActionTypes.CREATE,
    payload: response.data
  });

  history.push("/items");
};
