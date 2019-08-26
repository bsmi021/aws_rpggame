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

  return (
    <div>
      {item && (
        <NavLink to={`/items/${item.id}`} style={{ width: '125px' }}>
          <div
            style={{
              border: 'solid',
              borderWidth: '1px',
              width: '125px',
              height: '105px',
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
            <Header
              as="h5"
              // color={colorSelector(item.quality)}
              style={{ margin: '2px' }}
            >
              {item.name}
            </Header>
            {!item.equipped && props.isCurrentChar && (
              <Button.Group size="mini">
                <Button icon={true} onClick={handleEquipClick} size="mini">
                  <Icon name="plus" />
                </Button>
                <Button.Or />
                <Button icon={true} onClick={handleRemoveClick} size="mini">
                  <Icon name="trash" />
                </Button>
              </Button.Group>
            )}

            {item.equipped && props.isCurrentChar && (
              <Button
                icon={true}
                onClick={handleUnequipClick}
                size="mini"
                stlye={{ verticalAlign: 'bottom' }}
              >
                <Icon name="minus" />
              </Button>
            )}
          </div>
        </NavLink>
      )}
    </div>
  );
};

export default CharacterItemCardSmall;

/* 

    style={{
                  position: 'absolute',
                  alignContent: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%'
                }}

<div className={`${colorSelector(item.quality)} small`}>
          <div style={{ border: '1px', borderColor: 'black' }}>
            
          </div>
          <span className="right floated content">
            
          
          </span>
        </div>
  */
