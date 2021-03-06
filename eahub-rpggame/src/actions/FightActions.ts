import { ActionCreator, AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { API } from 'aws-amplify';

import { IApplicationState } from '../store/Store';
import {
  IFightLoadingAction,
  FightActionTypes,
  IFightStartAction,
  IFightGetSingleAction,
  IFightState,
  IFightAttackAction,
  IFightClaimLootAction
} from '../types/FightTypes';

const loading: ActionCreator<IFightLoadingAction> = () => ({
  type: FightActionTypes.LOADING
});

export const getFight: ActionCreator<
  ThunkAction<Promise<AnyAction>, IFightState, null, IFightGetSingleAction>
> = (id: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    dispatch(loading());

    const response = await API.get('fightsaggr', `fights/${id}`, null);
    const enemy = await API.get(
      'enemies',
      `enemies/${response.enemy.id}`,
      null
    );

    return dispatch({
      type: FightActionTypes.GETSINGLE,
      fight: response,
      enemy
    });
  };
};

export const attack: ActionCreator<
  ThunkAction<Promise<AnyAction>, IApplicationState, null, IFightAttackAction>
> = (characterId: string, fightId: string) => {
  return async (dispatch: Dispatch, getState) => {
    dispatch(loading());

    const attackrequest = {
      body: { character_id: characterId, fight_id: fightId }
    };
    const attackresponse = await API.post(
      'fightsaggr',
      'fights/attack',
      attackrequest
    );

    if (attackresponse) {
      const fight = await API.get('fightsaggr', `fights/${fightId}`, null);

      // if (fight.enemy.status === 'DEAD') {
      //   fight = await API.get('fightsaggr', `fights/${fightId}`, null);
      // }

      return dispatch({
        type: FightActionTypes.ATTACK,
        attack: attackresponse,
        fight
      });
    }

    return dispatch({
      type: FightActionTypes.ERROR
    });
  };
};

export const claimLoot: ActionCreator<
  ThunkAction<
    Promise<AnyAction>,
    IApplicationState,
    null,
    IFightClaimLootAction
  >
> = (fightId: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    dispatch(loading);
    const character = getState().characters.defaultCharacter;
    const characterId = character ? character.id : '';

    const claimRequest = {
      body: {
        char_id: characterId
      }
    };

    const response = await API.put(
      'fightsaggr',
      `fights/${fightId}/claim_loot`,
      claimRequest
    );

    return dispatch({
      type: FightActionTypes.CLAIM,
      fight: response
    });
  };
};

export const startFight: ActionCreator<
  ThunkAction<Promise<AnyAction>, IApplicationState, null, IFightStartAction>
> = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState) => {
    dispatch(loading());

    const character = getState().characters.defaultCharacter;
    const characterId = character ? character.id : '';

    const fightRequest = {
      body: {
        id: characterId
      }
    };

    const fightresponse = await API.post(
      'fightsaggr',
      'fights/start',
      fightRequest
    );

    if (fightresponse) {
      const fight = await API.get(
        'fightsaggr',
        `fights/${fightresponse.id}`,
        null
      );

      const enemy = await API.get('enemies', `enemies/${fight.enemy.id}`, null);

      return dispatch({
        type: FightActionTypes.START,
        enemy,
        fight
      });
    }

    return dispatch({
      type: FightActionTypes.ERROR
    });
  };
};
