import { Reducer } from 'redux';
import { ItemActionTypes, ItemActions, IItemsState } from '../types/ItemTypes';

const initialItemsState: IItemsState = {
  items: [],
  itemsLoading: false,
  currentItem: null,
  error: null
};

export const itemsReducer: Reducer<IItemsState, ItemActions> = (
  state = initialItemsState,
  action
) => {
  switch (action.type) {
    case ItemActionTypes.LOADING: {
      return {
        ...state,
        itemsLoading: true
      };
    }
    case ItemActionTypes.CLEAR: {
      return {
        ...state,
        items: [],
        itemsLoading: false,
        currentItem: null,
        error: null
      };
    }
    case ItemActionTypes.GETALL: {
      return {
        ...state,
        items: action.items,
        itemsLoading: false
      };
    }
    case ItemActionTypes.GETSINGLE: {
      return {
        ...state,
        currentItem: action.item,
        itemsLoading: false
      };
    }
    case ItemActionTypes.CREATE: {
      return {
        ...state,
        itemsLoading: false,
        items: state.items.concat(action.items)
      };
    }
    case ItemActionTypes.ERROR: {
      return {
        ...state,
        itemsLoading: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};
