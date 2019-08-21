import { ActionCreator, AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { API } from 'aws-amplify';
import {
  IEnemy,
  IEnemyLoadingAction,
  EnemyActionTypes,
  IEnemyGetSingleAction,
  IEnemyState
} from '../types/EnemyTypes';

const loading: ActionCreator<IEnemyLoadingAction> = () => ({
  type: EnemyActionTypes.LOADING
});

export const getEnemy: ActionCreator<
  ThunkAction<Promise<AnyAction>, IEnemyState, null, IEnemyGetSingleAction>
> = (id: string) => {
  return async (dispatch: ThunkDispatch<IEnemyState, undefined, any>) => {
    dispatch(loading());

    const enemy = await API.get('enemies', `enemies/${id}`, null);

    return dispatch({
      type: EnemyActionTypes.GETSINGLE,
      enemy
    });
  };
};
