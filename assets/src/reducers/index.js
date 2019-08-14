import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import characterReducers from "./characterReducers";
import itemReducers from "./itemReducers";

export default combineReducers({
  form: formReducer,
  characters: characterReducers,
  items: itemReducers
});
