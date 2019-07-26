import * as React from 'react';
import { ICharacter } from './CharacterType';
import { Row, Container, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Props {
  character?: ICharacter;
}

const Character: React.SFC<Props> = props => {
  const character = props.character;

  if (!character) {
    return null;
  }

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col lg="auto">
            <h3>{character.name}</h3>
          </Col>
        </Row>

        <Row>
          <Col lg="auto">
            <h6>Inventory</h6>
            {character.inventory ? (
              <ul className="items-list">
                {character.inventory.map(item => {
                  return (
                    <li key={item.id}>
                      <div>
                        <Link to={`/items/${item.id}`}>{item.name}</Link>
                        {item.slot}
                        {item.slot_name}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Character;
