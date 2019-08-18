import { CognitoUser } from '@aws-amplify/auth';

export interface IAuthProps {
  isAuthenticated: boolean;
  userHasAuthenticated: (authenticated: boolean) => void;
  authLoading: boolean;
}

export interface ISignIn {
  email: string;
  password: string;
}

export enum AuthActionTypes {
  SIGNIN = 'AUTH/SIGNIN',
  SIGNOUT = 'AUTH/SIGNOUT',
  LOADING = 'AUTH/LOADING'
}

export interface IAuthSignInAction {
  type: AuthActionTypes.SIGNIN;
  userId?: string | undefined;
  userName?: string | undefined;
}

export interface IAuthSignOutAction {
  type: AuthActionTypes.SIGNOUT;
}

export interface IAuthLoadingAction {
  type: AuthActionTypes.LOADING;
}

export type AuthActions =
  | IAuthSignInAction
  | IAuthSignOutAction
  | IAuthLoadingAction;

export interface IAuthState {
  readonly isAuthenticated: boolean;
  readonly userId?: string | undefined;
  readonly userName?: string | undefined;
  readonly authLoading: boolean;
}
