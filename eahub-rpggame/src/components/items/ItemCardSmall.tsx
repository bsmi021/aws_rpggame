import * as React from 'react';
import { connect } from 'react-redux';

import { IItem } from '../../types/ItemTypes';
import { getItems, getItem } from '../../actions/ItemActions';
import { IApplicationState } from '../../store/Store';
import { NavLink } from 'react-router-dom';
import { colorSelector } from './itemUtils';

interface IProps {
  item?: IItem;
}

const ItemCardSmall: React.FunctionComponent<IProps> = props => {
  const item = props.item;

  return (
    <div>
      {item && (
        <NavLink
          to={`/items/${item.id}`}
          className={`ui card raised ${colorSelector(item.quality)} small`}
        >
          <div className="content">
            <div className="header">{item.name}</div>
            <div className="meta">{item.slot_name}</div>
          </div>
        </NavLink>
      )}
    </div>
  );
};

export default ItemCardSmall;
