export interface IItem extends IItemBase {
  id: string;
  created_at: Date;
  modified_at: Date;
  quality_name: string;
  slot_name: string;
}

export interface IItemBase {
  name: string;
  description: string;
  quality: number;
  slot: number;
  damage: number;
  stamina: number;
  crit_chance: number;
  level: number;
  is_warrior: boolean;
  is_archer: boolean;
  is_rogue: boolean;
  is_sorcerer: boolean;
}

export enum ItemActionTypes {
  GETALL = 'ITEMS/GETALL',
  GETSINGLE = 'ITEMS/GETSINGLE',
  LOADING = 'ITEMS/LOADING',
  CREATE = 'ITEMS/CREATE',
  EDIT = 'ITEMS/EDIT',
  ERROR = 'ITEMS/ERROR'
}

export interface IItemsGetAllAction {
  type: ItemActionTypes.GETALL;
  items: IItem[];
}

export interface IItemGetSingleAction {
  type: ItemActionTypes.GETSINGLE;
  item: IItem;
}

export interface IItemLoadingAction {
  type: ItemActionTypes.LOADING;
}

export interface IItemCreateAction {
  type: ItemActionTypes.CREATE;
  items: IItem[];
}

export interface IItemEditAction {
  type: ItemActionTypes.EDIT;
  item: IItem;
}

export interface IItemErrorAction {
  type: ItemActionTypes.ERROR;
}

export type ItemActions =
  | IItemCreateAction
  | IItemEditAction
  | IItemGetSingleAction
  | IItemsGetAllAction
  | IItemErrorAction
  | IItemLoadingAction;

export interface IItemsState {
  readonly items: IItem[];
  readonly currentItem: IItem | null;
  readonly itemsLoading: boolean;
  readonly error: string | null;
}
