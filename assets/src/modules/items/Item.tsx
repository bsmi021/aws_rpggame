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
      <Container>
        <Row>
          <Col lg="auto">
            <h3>{item.name}</h3>
          </Col>
          <Col>Slot: {item.slot_name}</Col>
        </Row>
        <Row>
          <Col><h6>{item.quality_name}</h6></Col>
        </Row>
        <Row>
          <Col><i>{item.description}</i></Col>
        </Row>
        <Row>
          <Col>Damage: {item.damage}</Col>
          <Col>Critical Strike Chance %: {item.crit_chance}</Col>
          <Col>
            Stamina: {item.stamina} (this will provide {item.stamina * 10}{' '}
            hitpoints)
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Item;
