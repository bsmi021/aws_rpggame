import * as React from 'react';
import { IItem } from '../../types/ItemTypes';
import { equipItem, unequipItem } from '../../actions/CharacterActions';
import { useSelector, useDispatch } from 'react-redux';

import { IApplicationState } from '../../store/Store';
import { NavLink } from 'react-router-dom';
import { colorSelector } from './itemUtils';

interface IProps {
  item?: IItem;
}

export const ItemCard: React.FunctionComponent<IProps> = props => {
  const item = props.item;
  const dispatch = useDispatch();

  const defaultCharacter = useSelector((state: IApplicationState) => {
    return state.characters.defaultCharacter;
  });

  if (!item) {
    return <div />;
  }

  const onEquipClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (defaultCharacter) {
      dispatch(equipItem(defaultCharacter.id, item.id));
    }
  };

  const onUnequipClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (defaultCharacter) {
      dispatch(unequipItem(defaultCharacter.id, item.id));
    }
  };

  return (
    item && (
      <NavLink
        to={`/items/${item.id}`}
        className={`ui card raised ${colorSelector(item.quality)}`}
      >
        <div className="content">
          <div className="header">{item.name}</div>
          <div className="meta">{item.slot_name}</div>
          <div className="description">{item.description}</div>

          {(defaultCharacter &&
            defaultCharacter.inventory &&
            (defaultCharacter.inventory.filter((i: IItem) => i.id === item.id)
              .length === 0 && (
              <div className="extra content ">
                <button className="ui mini button" onClick={onEquipClick}>
                  <i className="plus icon green" />
                  Equip
                </button>
              </div>
            ))) ||
            (defaultCharacter && defaultCharacter.inventory && (
              <div className="extra content ">
                <button className="ui mini button" onClick={onUnequipClick}>
                  <i className="minus icon red" />
                  Unequip
                </button>
              </div>
            ))}
        </div>
      </NavLink>
    )
  );
};

export default ItemCard;
