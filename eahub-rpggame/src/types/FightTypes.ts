import { IEnemy } from './EnemyTypes';

export interface IFightEnemy {
  id: string;
  status: string;
  block_amt: number;
  can_block: boolean;
  dodge_pct: number;
  block_pct: number;
  base_hp: number;
  prev_hp: number;
  curr_hp: number;
  can_dodge: boolean;
}

export interface IFightCharacter {
  id: string;
  status: string;
  max_damage: number;
  attack_speed: number;
  min_damage: number;
  prev_hp: number;
  curr_hp: number;
  crit_chance: number;
  loot_claimed: boolean;
  loot_item_id: string | undefined;
}

export interface IFight {
  id: string;
  created_at: Date;
  is_active: boolean;
  updated_at: Date;
  enemy: IFightEnemy;
  characters: IFightCharacter[];
}

export interface IAttack {
  id: string;
  attack_amt: number;
  block_amt: number;
  created_at: Date;
  is_blocked: boolean;
  is_critical: boolean;
  is_dodged: boolean;
  is_missed: boolean;
  t_curr_hp: number;
  t_prev_hp: number;
  updated_at: Date;
  source_id: string;
  source_tp: string;
  target_id: string;
  target_tp: string;
  fight_id: string;
  attack_ts: Date;
}

export enum FightActionTypes {
  GETSINGLE = 'FIGHTS/GETSINGLE',
  START = 'FIGHTS/START',
  ATTACK = 'FIGHTS/ATTACK',
  LOADING = 'FIGHTS/LOADING',
  ERROR = 'FIGHTS/ERROR',
  CLAIM = 'FIGHTS/CLAIM',
  CLEAR = 'FIGHTS/CLEAR'
}

export interface IFightClearAction {
  type: FightActionTypes.CLEAR;
}

export interface IFightLoadingAction {
  type: FightActionTypes.LOADING;
}

export interface IFightStartAction {
  type: FightActionTypes.START | FightActionTypes.ERROR;
  fight: IFight;
  enemy: IEnemy;
}

export interface IFightClaimLootAction {
  type: FightActionTypes.CLAIM;
  fight: IFight;
}

export interface IFightAttackAction {
  type: FightActionTypes.ATTACK;
  attack: IAttack;
  fight: IFight;
}

export interface IFightGetSingleAction {
  type: FightActionTypes.GETSINGLE;
  fight: IFight;
  enemy: IEnemy;
}

export type FightActions =
  | IFightLoadingAction
  | IFightStartAction
  | IFightGetSingleAction
  | IFightClaimLootAction
  | IFightClearAction
  | IFightAttackAction;

export interface IFightState {
  readonly fights: IFight[];
  readonly currentFight: IFight | null;
  readonly attacks: IAttack[];
  readonly currentAttack: IAttack | null;
  readonly fightsLoading: boolean;
  readonly fightStartError: boolean;
  readonly currentFightEnemy: IEnemy | null;
  readonly currentFightCharacter: IFightCharacter | null;
}
