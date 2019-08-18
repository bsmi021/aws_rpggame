import { Reducer } from 'redux';
import { IAuthState, AuthActionTypes, AuthActions } from '../types/AuthTypes';
import { CognitoUser } from '@aws-amplify/auth';

const initialAuthState: IAuthState = {
  userId: undefined,
  userName: undefined,
  isAuthenticated: false,
  authLoading: false
};

export const authReducer: Reducer<IAuthState, AuthActions> = (
  state = initialAuthState,
  action
) => {
  switch (action.type) {
    case AuthActionTypes.LOADING: {
      return { ...state, authLoading: true };
    }
    case AuthActionTypes.SIGNOUT: {
      return {
        ...state,
        auth: undefined,
        isAuthenticated: false,
        authLoading: false,
        userId: undefined,
        userName: undefined
      };
    }
    case AuthActionTypes.SIGNIN: {
      return {
        ...state,
        userId: action.userId,
        userName: action.userName,
        isAuthenticated: true,
        authLoading: false
      };
    }
    default:
      return state;
  }
};
