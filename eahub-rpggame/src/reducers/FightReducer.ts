import { Reducer } from 'redux';
import {
  IFightState,
  FightActions,
  FightActionTypes
} from '../types/FightTypes';

const initialFightState: IFightState = {
  fights: [],
  attacks: [],
  currentAttack: null,
  currentFight: null,
  currentFightEnemy: null,
  fightStartError: false,
  fightsLoading: false,
  currentFightCharacter: null
};

export const fightsReducer: Reducer<IFightState, FightActions> = (
  state = initialFightState,
  action
) => {
  switch (action.type) {
    case FightActionTypes.LOADING: {
      return {
        ...state,
        fightsLoading: true
      };
    }
    case FightActionTypes.CLEAR: {
      return {
        ...state,
        fights: [],
        attacks: [],
        currentAttack: null,
        currentFight: null,
        currentFightEnemy: null,
        fightStartError: false,
        fightsLoading: false,
        currentFightCharacter: null
      };
    }
    case FightActionTypes.START: {
      return {
        ...state,
        fightsLoading: false,
        currentFight: action.fight,
        fights: state.fights.concat(action.fight),
        attacks: [],
        currentFightEnemy: action.enemy
      };
    }
    case FightActionTypes.GETSINGLE: {
      return {
        ...state,
        currentFight: action.fight,
        fightsLoading: false,
        currentFightEnemy: action.enemy
      };
    }
    case FightActionTypes.CLAIM: {
      return {
        ...state,
        currentFight: action.fight,
        fightsLoading: false
      };
    }
    case FightActionTypes.ATTACK: {
      return {
        ...state,
        currentFight: action.fight,
        currentAttack: action.attack,
        attacks: [...state.attacks, action.attack]
      };
    }
    case FightActionTypes.ERROR: {
      return {
        ...state,
        fightsLoading: false,
        currentFight: null,
        fightStartError: true
      };
    }

    default:
      return state;
  }
};
