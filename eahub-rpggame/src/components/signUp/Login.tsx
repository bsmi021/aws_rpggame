import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import { ISignIn } from '../../types/AuthTypes';
import { signIn } from '../../actions/AuthActions';
import { Form, Input } from 'semantic-ui-react';
import { Redirect } from 'react-router';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface IProps {
  loading: boolean;
  signIn: typeof signIn;
  isAuthenticated: boolean;
}

interface IState {
  redirect: boolean;
  email: string;
  password: string;
  emailValid: 'success' | 'error' | 'warning' | undefined;
  passwordValid: 'success' | 'error' | 'warning' | undefined;
}

class Login extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      redirect: false,
      email: '',
      password: '',
      emailValid: undefined,
      passwordValid: undefined
    };
  }

  public render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <div className="Login">
        <Form onSubmit={e => this.onLogin(e)} className="ui large form">
          <Form.Group>
            <Form.Field
              required={true}
              id="form-input-control-email"
              control={Input}
              label="Email"
              onChange={this.onEmailChange}
              value={this.state.email}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field
              required={true}
              id="form-input-control-password"
              control={Input}
              type="password"
              label="Password"
              onChange={this.onPasswordChange}
              value={this.state.password}
            />
          </Form.Group>
          <Form.Button type="submit" className="ui fluid medium" large={true}>
            Login
          </Form.Button>
        </Form>
      </div>
    );
  }

  private async onLogin(event: React.FormEvent<HTMLFormElement>) {
    console.log('got here');
    this.props.signIn({
      email: this.state.email,
      password: this.state.password
    });
  }

  private onEmailChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    this.setState({
      email: target.value,
      emailValid: emailRegex.test(target.value.toLowerCase())
        ? 'success'
        : 'error'
    });
  };

  private onPasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    this.setState({
      password: target.value,
      passwordValid: target.value.length < 8 ? 'error' : 'success'
    });
  };
}

const mapStateToProps = (store: IApplicationState) => {
  return {
    loading: store.auth.authLoading,
    isAuthenticated: store.auth.isAuthenticated
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    signIn: (signInProps: ISignIn) => dispatch(signIn(signInProps))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

/*

        <form className="ui large form" onSubmit={e => this.onLogin(e)}>
          <div className="ui stacked segment">
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon" />
                <input
                  type="text"
                  name="email"
                  placeholder="E-mail address"
                  onChange={this.onEmailChange}
                  value={this.state.email}
                />
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.onPasswordChange}
                  value={this.state.password}
                />
              </div>
            </div>
            <div className="ui fluid large blue submit button">Login</div>
          </div>
          <div className="ui error message" />
        </form>
 

*/
