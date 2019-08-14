import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import * as serviceWorker from "./serviceWorker";
import config from "./config";
import Amplify from "aws-amplify";

import "bootstrap/dist/css/bootstrap.css";
import RoutesWrap from "./Routes";
import App from "./App";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
import reduxThunk from "redux-thunk";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

// import 'bootstrap/dist/css/bootstrap-theme.css';
// const componseEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ || compose;
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);

Amplify.configure({
  API: {
    endpoints: [
      {
        name: "items",
        endpoint: config.apiGateway.ITEMS_API_URL,
        region: config.apiGateway.REGION
      },
      {
        name: "characters",
        endpoint: config.apiGateway.CHARS_API_URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
