import { ICharacter }  from '../modules/characters/CharacterType';

export enum CharacterActionTypes {
    FETCH_ALL = 'CUSTOMERS/FETCH_ALL',
    FETCH_ONE = 'CUSTOMERS/FETCH_ONE',
    CREATE = 'CUSTOMERS/CREATE',
    EDIT = 'CUSTOMERS/EDIT',
    DELETE = 'CUSTOEMRS/DELETE'
}

export enum ItemActionTypes {
    FETCH_ALL = 'ITEMS/FETCH_ALL',
    FETCH_ONE = 'ITEMS/FETCH_ONE',
    CREATE = 'ITEMS/CREATE',
    EDIT = 'ITEMS/EDIT',
    DELETE = 'ITEMS/DELETE'
}
// export default {CREATE_CHARACTER}

export interface IFetchAllCustomersAction {
    type: CharacterActionTypes.FETCH_ALL,
    character: ICharacter[]
}

export interface IFetchOneCustomerAction {
    type: CharacterActionTypes.FETCH_ONE,
    character: ICharacter 
}
