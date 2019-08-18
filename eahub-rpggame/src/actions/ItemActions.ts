import { ActionCreator, AnyAction, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { API } from 'aws-amplify';

import {
  IItem,
  IItemCreateAction,
  IItemEditAction,
  IItemGetSingleAction,
  IItemLoadingAction,
  IItemsGetAllAction,
  IItemsState,
  ItemActionTypes
} from '../types/ItemTypes';

const loading: ActionCreator<IItemLoadingAction> = () => ({
  type: ItemActionTypes.LOADING
});

export const getItems: ActionCreator<
  ThunkAction<Promise<AnyAction>, IItemsState, null, IItemsGetAllAction>
> = () => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());
    const response = await API.get('items', '/items', null);
    const items = response.items;
    return dispatch({
      items,
      type: ItemActionTypes.GETALL
    });
  };
};

export const getItem: ActionCreator<
  ThunkAction<Promise<AnyAction>, IItemsState, null, IItemGetSingleAction>
> = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());
    const response = await API.get('items', `/items/${id}`, null);
    const item = response;
    return dispatch({
      item,
      type: ItemActionTypes.GETSINGLE
    });
  };
};
