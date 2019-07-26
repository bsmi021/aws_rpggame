import * as React from 'react';
import { ICharacter } from './CharacterType';
import { Row, Container, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Item from '../items/Item';
import './character.css';

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
        <div className="CharacterHeader">
          <Row>
            <Col lg="auto">
              <div className="CharacterHeader Character-name">
                {character.name}
              </div>
              <div className="CharacterHeader Character-info">
                <div className="CharacterHeader-detail">{character.level}</div>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          <Col lg="auto">
            <div className="CharacterBody Character-stats">
              <div className="CharacterBody Character-stats health">
                HEALTH: {character.hit_points}
              </div>
            </div>
          </Col>
          <Col lg="auto">
            <div className="CharacterBody Character-stats">
              <div className="CharacterBody Character-stats damage">
                MIN DAMAGE: {character.min_damage}
              </div>
            </div>
          </Col>
          <Col lg="auto">
            <div className="CharacterBody Character-stats">
              <div className="CharacterBody Character-stats damage">
                MAX DAMAGE: {character.max_damage}
              </div>
            </div>
          </Col>
          <Col lg="auto">
            <div className="CharacterBody Character-stats">
              <div className="CharacterBody Character-stats damage">
                CRITICAL STRIKE %: {character.crit_chance}
              </div>
            </div>
          </Col>
          <Col />
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
                        <Item item={item} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col lg="auto">
            <div className="CharacterFooter">
              <div className="CharacterFooter Character-dates">
                <div>Created On: {character.created_at}</div>
                <div>Last Modified On: {character.updated_at}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Character;
