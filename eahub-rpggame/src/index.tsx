import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import config from './config';
import configureStore from './store/Store';
import Root from './components/root/Root';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    // region: awsmobile.aws_cognito_region,
    // userPoolId: awsmobile.aws_user_pools_id,
    // identityPoolId: awsmobile.aws_cognito_identity_pool_id,
    // userPoolWebClientId: awsmobile.aws_user_pools_web_client_id
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    // commented out for now need to investigate
    // identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: 'items',
        endpoint: config.apiGateway.ITEMS_AGGR_URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'characters',
        endpoint: config.apiGateway.CHARS_API_URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'charsaggr',
        endpoint: config.apiGateway.CHARS_AGGR_URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'fightsaggr',
        endpoint: config.apiGateway.FIGHTS_AGGR_URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'fights',
        endpoint: config.apiGateway.FIGHTS_URL,
        region: config.apiGateway.REGION
      },
      {
        name: 'enemies',
        endpoint: config.apiGateway.ENEMIES_URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

const store = configureStore();

ReactDOM.render(<Root store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
