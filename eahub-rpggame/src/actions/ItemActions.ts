import { ActionCreator, AnyAction, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { API } from 'aws-amplify';

import {
  // IItem,
  IItemCreateAction,
  // IItemEditAction,
  IItemGetSingleAction,
  IItemLoadingAction,
  IItemsGetAllAction,
  IItemsState,
  ItemActionTypes,
  IItemBase
} from '../types/ItemTypes';
import { async } from 'q';

const loading: ActionCreator<IItemLoadingAction> = () => ({
  type: ItemActionTypes.LOADING
});

export const getItems: ActionCreator<
  ThunkAction<Promise<AnyAction>, IItemsState, null, IItemsGetAllAction>
> = (slot?: number, quality?: number, level?: number) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());
    let queryParams = null;
    if (slot) {
      queryParams = queryParams
        ? queryParams + '&' + `slot=${slot}`
        : `slot=${slot}`;
    }
    if (quality) {
      queryParams = queryParams
        ? queryParams + '&' + `quality=${quality}`
        : `quality=${quality}`;
    }
    if (level) {
      queryParams = queryParams
        ? queryParams + '&' + `level=${level}`
        : `${level}`;
    }

    queryParams = queryParams ? '?' + queryParams : null;
    const response = await API.get(
      'items',
      `/items${queryParams ? queryParams : ''}`,
      null
    );
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

export const createItem: ActionCreator<
  ThunkAction<Promise<AnyAction>, IItemsState, null, IItemCreateAction>
> = (itemVals: IItemBase) => {
  return async (dispatch: Dispatch) => {
    const request = {
      body: itemVals
    };

    const item = await API.post('items', 'items', request).catch(e =>
      alert('There was a problem saving this item')
    );

    return dispatch({
      type: ItemActionTypes.CREATE,
      item
    });
  };
};
