import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import config from './config';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import configureStore, { IApplicationState } from './store/Store';
import RoutesWrap from './components/router/Routes';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
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

interface IProps {
  store: Store<IApplicationState>;
}

const Root: React.FunctionComponent<IProps> = props => {
  return (
    <Provider store={props.store}>
      <RoutesWrap />
    </Provider>
  );
};

const store = configureStore();

ReactDOM.render(<Root store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
