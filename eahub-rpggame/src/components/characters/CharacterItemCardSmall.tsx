import * as React from 'react';

import { IItem } from '../../types/ItemTypes';
import { NavLink } from 'react-router-dom';
import { colorSelector, itemSlotIcon } from '../items/itemUtils';
import { Grid, Popup, Image, Segment, Button } from 'semantic-ui-react';
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

const ItemCardSmall: React.FunctionComponent<IProps> = props => {
  const item = props.item;
  const dispatch = useDispatch();

  const handleEquipClick = (e: any) => {
    e.preventDefault();
    if (props.item) {
      console.log('equip');
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
        <div>
          <Popup
            content={
              <Grid>
                <Grid.Row>
                  <Grid.Column>{item.description}</Grid.Column>
                </Grid.Row>
                <Grid.Row>{item.damage}</Grid.Row>
              </Grid>
            }
            header={item.name}
            trigger={
              <NavLink
                to={`/items/${item.id}`}
                className={`${colorSelector(item.quality)} small`}
              >
                <Image
                  src={itemSlotIcon(item.slot)}
                  avatar={true}
                  className="left floated"
                />
              </NavLink>
            }
          />
          <span className="right floated content">
            {!item.equipped && props.isCurrentChar && (
              <span>
                <button className="mini button" onClick={handleEquipClick}>
                  <i className="plus icon" />
                </button>
                <button className="mini button" onClick={handleRemoveClick}>
                  <i className="trash alternate outline icon" />
                </button>
              </span>
            )}
            {item.equipped && props.isCurrentChar && (
              <button className="mini button" onClick={handleUnequipClick}>
                <i className="minus icon centered" />
              </button>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default ItemCardSmall;
