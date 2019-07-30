import * as React from 'react';
import { IItem } from './ItemType';
import { Row, Container, Col } from 'react-bootstrap';

interface Props {
  item?: IItem;
}

const Item: React.SFC<Props> = props => {
  const item = props.item;

  if (!item) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="card">
        <div className="card-title">
          <h4>{item.name}</h4>
          <p>{item.description}</p>
        </div>
        <div className="card-subtitle">
          <h5>{item.slot_name}</h5>
        </div>
        <div className="card-body">
          <div>
            <div>
              <h6>Damage</h6>
              <p>{item.damage}</p>
            </div>
            <div>
              <h6>Stamina</h6>
              <p>{item.stamina}</p>
            </div>
            <div>
              <h6>Crit Chance %</h6>
              <p>{item.crit_chance}</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Item;
