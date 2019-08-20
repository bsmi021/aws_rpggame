import { ActionCreator, AnyAction, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { Auth } from 'aws-amplify';

import {
  IAuthLoadingAction,
  IAuthSignInAction,
  IAuthSignOutAction,
  AuthActionTypes,
  IAuthState,
  ISignIn,
  IAuthSignedInAction
} from '../types/AuthTypes';

const loading: ActionCreator<IAuthLoadingAction> = () => ({
  type: AuthActionTypes.LOADING
});

export const signedIn: ActionCreator<
  ThunkAction<Promise<AnyAction>, IAuthState, null, IAuthSignedInAction>
> = (userId: string, userName: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());

    return dispatch({
      type: AuthActionTypes.SIGNEDIN,
      userName,
      userId,
      isAuthenticated: true
    });
  };
};

export const signIn: ActionCreator<
  ThunkAction<Promise<AnyAction>, IAuthState, null, IAuthSignInAction>
> = (signParams: ISignIn) => {
  return async (dispatch: Dispatch) => {
    dispatch(loading());

    // TODO: Handle not logged in

    const user = await Auth.signIn(signParams.email, signParams.password);

    const userName = user.username;
    const userId = user.attributes.sub;

    // Auth.currentSession()
    //   .then(data => {
    //     console.log(data);
    //     window.sessionStorage.setItem('session', stringify(data));
    //   })
    //   .catch(err => console.log(err));

    // if (session) {
    //   window.sessionStorage.setItem(session, stringifiedUserToken);
    // }

    return dispatch({
      isAuthenticated: true,
      userName,
      userId,
      type: AuthActionTypes.SIGNIN
    });
  };
};

export const signOut: ActionCreator<
  ThunkAction<Promise<AnyAction>, IAuthState, null, IAuthSignOutAction>
> = () => {
  return async (dispatch: Dispatch) => {
    await Auth.signOut();

    return dispatch({
      isAuthenticated: false,
      auth: {},
      type: AuthActionTypes.SIGNOUT
    });
  };
};
