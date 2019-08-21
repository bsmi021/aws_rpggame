import * as React from 'react';
import { IApplicationState } from '../../store/Store';
import { Store } from 'redux';
import { Provider, connect } from 'react-redux';
import RoutesWrap from '../router/Routes';
import { Authenticator, Greetings } from 'aws-amplify-react';
import { Auth } from 'aws-amplify';
import { signedIn } from '../../actions/AuthActions';
import awsmobile from '../../config';

interface IProps {
  store: Store<IApplicationState>;
  signedIn: typeof signedIn;
  isAuthenticated: boolean;
}

class Root extends React.Component<IProps> {
  public render() {
    document.title = 'SAS® SAScraft Demo';
    return (
      <Provider store={this.props.store}>
        {!this.props.isAuthenticated && (
          <div className="ui container">
            <h1>Welcome to SAScraft</h1>
          </div>
        )}
        <Authenticator
          hide={[Greetings]}
          onStateChange={(res: any) => {
            this.setState({ authState: res });
            if (res === 'signedIn') {
              Auth.currentAuthenticatedUser().then(user => {
                const userId = user.attributes.sub;
                const userName = user.username;

                this.props.signedIn(userId, userName);
              });
            }
          }}
        >
          {this.props.isAuthenticated && <RoutesWrap />}
        </Authenticator>
      </Provider>
    );
  }
}

const mapStateToProps = (state: IApplicationState) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    signedIn: (userId: string, userName: string) =>
      dispatch(signedIn(userId, userName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
