import { IItem } from './ItemTypes';

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
  inventory?: IItem[];
  created_at: string;
  updated_at: string;
  player_class_name: string;
  attack_speed: number;
  can_dual_wield: boolean;
  can_use_2h: boolean;
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
  UNEQUIPITEM = 'CHARACTERS/UNEQUIPITEM'
}

export interface ICharacterGetAllAction {
  type: CharacterActionTypes.GETALL;
  characters: ICharacter[];
}

export interface ICharacterGetSingleAction {
  type: CharacterActionTypes.GETSINGLE;
  character: ICharacter;
}

export interface ICharacterLoading {
  type: CharacterActionTypes.LOADING;
}

export interface ICharacterCreate {
  type: CharacterActionTypes.CREATE;
  character: ICharacter;
}

export interface ICharacterEdit {
  type: CharacterActionTypes.EDIT;
  character: ICharacter;
}

export interface ICharacterDelete {
  type: CharacterActionTypes.DELETE;
}

export interface ICharacterSetDefault {
  type: CharacterActionTypes.SETDEFAULT;
  character: ICharacter;
}

export interface ICharacterEquipItem {
  type: CharacterActionTypes.EQUIPITEM;
  character: ICharacter;
}

export interface ICharacterUnequipItem {
  type: CharacterActionTypes.UNEQUIPITEM;
  character: ICharacter;
}

export type CharacterActions =
  | ICharacterCreate
  | ICharacterDelete
  | ICharacterEdit
  | ICharacterGetAllAction
  | ICharacterGetSingleAction
  | ICharacterLoading
  | ICharacterSetDefault
  | ICharacterUnequipItem
  | ICharacterEquipItem;

export interface ICharacterState {
  readonly characters: ICharacter[];
  readonly charactersLoading: boolean;
  readonly currentCharacter: ICharacter | null;
  readonly defaultCharacter: ICharacter | null;
}
