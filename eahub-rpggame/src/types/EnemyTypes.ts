export interface IEnemy {
  base_hp: number;
  block_amt: number;
  block_pct: number;
  can_block: boolean;
  can_dodge: boolean;
  created_at: Date;
  current_hp: number;
  dodge_pct: number;
  hit_points: number;
  level: number;
  updated_at: Date;
  status: string;
  en_race: number;
  en_race_name: string;
  id: string;
}

export enum EnemyActionTypes {
  LOADING = 'ENEMIES/LOADING',
  GETALL = 'ENEMIES/GETALL',
  GETSINGLE = 'ENEMIES/GETSINGLE',
  CLEAR = 'ENEMIES/CLEAR'
}

export interface IEnemyClearAction {
  type: EnemyActionTypes.CLEAR;
}
export interface IEnemyLoadingAction {
  type: EnemyActionTypes.LOADING;
}

export interface IEnemyGetAllAction {
  type: EnemyActionTypes.GETALL;
  enemies: IEnemy[];
}

export interface IEnemyGetSingleAction {
  type: EnemyActionTypes.GETSINGLE;
  enemy: IEnemy;
}

export type EnemyActions =
  | IEnemyLoadingAction
  | IEnemyGetAllAction
  | IEnemyClearAction
  | IEnemyGetSingleAction;

export interface IEnemyState {
  readonly enemiesLoading: boolean;
  readonly enemies: IEnemy[];
  readonly currentEnemy: IEnemy | null;
}
