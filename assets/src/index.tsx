import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './config';
import Amplify from 'aws-amplify';

import 'bootstrap/dist/css/bootstrap.css';
import RoutesWrap from './Routes';
// import 'bootstrap/dist/css/bootstrap-theme.css';

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'items',
        endpoint: config.apiGateway.ITEMS_API_URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'characters',
        endpoint: config.apiGateway.CHARS_API_URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

ReactDOM.render(<RoutesWrap />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
