import * as React from 'react';

import { IItem } from '../../types/ItemTypes';
import { NavLink } from 'react-router-dom';
import { colorSelector, itemSlotIcon, itemQualities } from '../items/itemUtils';
import {
  Grid,
  Popup,
  Image,
  Segment,
  Button,
  Header,
  Icon
} from 'semantic-ui-react';
import { ICharacterInventoryItem } from '../../types/CharacterTypes';
import {
  equipItem,
  unequipItem,
  removeItem
} from '../../actions/CharacterActions';
import { useDispatch } from 'react-redux';

interface IProps {
  item?: ICharacterInventoryItem;
  charId: string;
  isCurrentChar: boolean;
}

const CharacterItemCardSmall: React.FunctionComponent<IProps> = props => {
  const item = props.item;
  const dispatch = useDispatch();

  const handleEquipClick = (e: any) => {
    e.preventDefault();
    if (props.item) {
      dispatch(equipItem(props.charId, props.item.inv_id));
    }
  };

  const handleUnequipClick = (e: any) => {
    e.preventDefault();
    if (props.item) {
      dispatch(unequipItem(props.charId, props.item.inv_id));
    }
  };

  const handleRemoveClick = (e: any) => {
    e.preventDefault();
    if (props.item) {
      dispatch(removeItem(props.charId, props.item.inv_id));
    }
  };

  const itemNotEquippedToggle = () => {
    return (
      <Button.Group size="mini">
        <Button icon={true} onClick={handleEquipClick} size="mini">
          <Icon name="plus" />
        </Button>
        <Button.Or />
        <Button icon={true} onClick={handleRemoveClick} size="mini">
          <Icon name="trash" />
        </Button>
      </Button.Group>
    );
  };

  const itemEquippedToggle = () => {
    return (
      <Button
        icon={true}
        onClick={handleUnequipClick}
        size="mini"
        stlye={{ verticalAlign: 'bottom' }}
      >
        <Icon name="minus" />
      </Button>
    );
  };

  if (!item) {
    return null;
  }

  return (
    <NavLink
      to={`/items/${item.id}`}
      style={{ width: '125px', maxHeight: '105px', height: '105px' }}
    >
      <div
        style={{
          border: 'solid',
          borderWidth: '1px',
          width: '125px',
          height: '105px',
          maxHeight: '105px',
          borderColor: 'white', // `${colorSelector(item.quality)}`,
          margin: '4px',
          boxShadow: `3px 3px 5px -2px ${colorSelector(item.quality)}`,
          padding: '3px'
        }}
      >
        <Image
          src={itemSlotIcon(item.slot)}
          avatar={true}
          style={{ margin: '1px' }}
        />
        <Header as="h5" style={{ margin: '2px' }}>
          {item.name}
        </Header>
        {props.isCurrentChar
          ? !item.equipped
            ? itemNotEquippedToggle()
            : itemEquippedToggle()
          : null}
      </div>
    </NavLink>
  );
};

export default CharacterItemCardSmall;
