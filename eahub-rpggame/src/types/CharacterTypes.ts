import { IItem } from './ItemTypes';

export interface ICharacterInventoryItem extends IItem {
  equipped: boolean;
  inv_id: string;
}

export interface ICharacter {
  id: string;
  name: string;
  account: string;
  level: number;
  base_hp: number;
  xp_gained: number;
  base_min_damage: number;
  base_max_damage: number;
  base_crit_chance: number;
  base_miss_chance: number;
  base_critical_multiplier: number;
  min_damage: number;
  max_damage: number;
  crit_chance: number;
  hit_points: number;
  current_hp: number;
  inventory?: ICharacterInventoryItem[];
  created_at: string;
  updated_at: string;
  player_class_name: string;
  attack_speed: number;
  can_dual_wield: boolean;
  can_use_2h: boolean;
  xp_to_lvl: number;
  curr_lvl_xp: number;
}

export enum CharacterClasses {
  WARRIOR = 'WARRIOR',
  SORCERER = 'SORCERER',
  ROGUE = 'ROGUE',
  ARCHER = 'ARCHER'
}

export enum CharacterActionTypes {
  GETALL = 'CHARACTERS/GETALL',
  GETSINGLE = 'CHARACTERS/GETSINGLE',
  LOADING = 'CHARACTERS/LOADING',
  CREATE = 'CHARACTERS/CREATE',
  EDIT = 'CHARACTERS/EDIT',
  DELETE = 'CHARACTERS/DELETE',
  SETDEFAULT = 'CHARACTERS/SETDEFAULT',
  EQUIPITEM = 'CHARACTERS/EQUIPITEM',
  UNEQUIPITEM = 'CHARACTERS/UNEQUIPITEM',
  ADDITEM = 'CHARACTERS/ADDITEM',
  REMOVEITEM = 'CHARACTERS/REMOVEITEM',
  ERROR = 'CHARACTERS/ERROR',
  CLEAR = 'CHARACTERS/CLEAR'
}

export interface ICharacterGetAllAction {
  type: CharacterActionTypes.GETALL;
  characters: ICharacter[];
}

export interface ICharacterClearAction {
  type: CharacterActionTypes.CLEAR;
}
export interface ICharacterGetSingleAction {
  type: CharacterActionTypes.GETSINGLE;
  character: ICharacter;
}

export interface ICharacterLoadingAction {
  type: CharacterActionTypes.LOADING;
}

export interface ICharacterErrorAction {
  type: CharacterActionTypes.ERROR;
  error: string;
}

export interface ICharacterCreateAction {
  type: CharacterActionTypes.CREATE;
  character: ICharacter;
}

export interface ICharacterEditAction {
  type: CharacterActionTypes.EDIT;
  character: ICharacter;
}

export interface ICharacterDeleteAction {
  type: CharacterActionTypes.DELETE;
}

export interface ICharacterSetDefaultAction {
  type: CharacterActionTypes.SETDEFAULT;
  character: ICharacter;
}

export interface ICharacterEquipItemAction {
  type: CharacterActionTypes.EQUIPITEM;
  character: ICharacter;
}

export interface ICharacterUnequipItemAction {
  type: CharacterActionTypes.UNEQUIPITEM;
  character: ICharacter;
}

export interface ICharacterAddItemAction {
  type: CharacterActionTypes.ADDITEM;
  character: ICharacter;
}

export interface ICharacterRemoveItemAction {
  type: CharacterActionTypes.REMOVEITEM;
  character: ICharacter;
}

export type CharacterActions =
  | ICharacterCreateAction
  | ICharacterDeleteAction
  | ICharacterEditAction
  | ICharacterGetAllAction
  | ICharacterGetSingleAction
  | ICharacterLoadingAction
  | ICharacterSetDefaultAction
  | ICharacterUnequipItemAction
  | ICharacterEquipItemAction
  | ICharacterRemoveItemAction
  | ICharacterErrorAction
  | ICharacterClearAction
  | ICharacterAddItemAction;

export interface ICharacterState {
  readonly characters: ICharacter[];
  readonly charactersLoading: boolean;
  readonly currentCharacter: ICharacter | null;
  readonly defaultCharacter: ICharacter | null;
  readonly error: string | null;
}
