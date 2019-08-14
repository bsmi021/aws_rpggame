import _ from "lodash";

import { ItemActionTypes } from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ItemActionTypes.FETCH_ALL:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case ItemActionTypes.FETCH_ONE:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
