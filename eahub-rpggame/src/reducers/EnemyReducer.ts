import { Reducer } from 'redux';
import {
  IEnemyState,
  EnemyActions,
  EnemyActionTypes
} from '../types/EnemyTypes';

const initialEnemyState: IEnemyState = {
  enemies: [],
  enemiesLoading: false,
  currentEnemy: null
};

export const enemiesReducer: Reducer<IEnemyState, EnemyActions> = (
  state = initialEnemyState,
  action
) => {
  switch (action.type) {
    case EnemyActionTypes.LOADING: {
      return {
        ...state,
        enemiesLoading: false
      };
    }
    case EnemyActionTypes.GETSINGLE: {
      return {
        ...state,
        currentEnemy: action.enemy
      };
    }
    case EnemyActionTypes.GETALL: {
      return {
        ...state,
        enemies: action.enemies
      };
    }
    default:
      return state;
  }
};
