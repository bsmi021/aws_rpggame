import _ from "lodash";

import { CharacterActionTypes } from "../actions/types";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CharacterActionTypes.FETCH_ALL:
      return { ...state, ..._.mapKeys(action.payload, "id") };
    case CharacterActionTypes.FETCH_ONE:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
};
