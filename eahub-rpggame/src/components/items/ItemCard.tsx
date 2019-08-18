import * as React from 'react';
import { IItem } from '../../types/ItemTypes';
import { getItem } from '../../actions/ItemActions';
import { connect, useSelector, useDispatch } from 'react-redux';

import { IApplicationState } from '../../store/Store';
import { Card } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

interface IProps {
  item?: IItem;
}

const colorSelector = (quality: number) => {
  switch (quality) {
    case 2:
      return 'blue';
    case 3:
      return 'purple';
    case 4:
      return 'orange';
    default:
      return 'green';
  }
};

export const ItemCard: React.FunctionComponent<IProps> = props => {
  const item = props.item;
  if (!item) {
    return <div />;
  }

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
        </div>
      </NavLink>
    )
  );
};

export default ItemCard;
