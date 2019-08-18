export interface IItem {
  id: string;
  name: string;
  created_at: Date;
  modified_at: Date;
  description: string;
  quality: number;
  quality_name: string;
  slot: number;
  slot_name: string;
  damage: number;
  stamina: number;
  crit_chance: string;
}

export enum ItemActionTypes {
  GETALL = 'ITEMS/GETALL',
  GETSINGLE = 'ITEMS/GETSINGLE',
  LOADING = 'ITEMS/LOADING',
  CREATE = 'ITEMS/CREATE',
  EDIT = 'ITEMS/EDIT'
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
  item: IItem;
}

export interface IItemEditAction {
  type: ItemActionTypes.EDIT;
  item: IItem;
}

export type ItemActions =
  | IItemCreateAction
  | IItemEditAction
  | IItemGetSingleAction
  | IItemsGetAllAction
  | IItemLoadingAction;

export interface IItemsState {
  readonly items: IItem[];
  readonly currentItem: IItem | null;
  readonly itemsLoading: boolean;
}
