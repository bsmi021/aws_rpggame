import * as React from 'react';
import { ICharacter } from './CharacterType';
import { Row, Container, Col, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Item from '../items/Item';
import './character.css';
import { ItemRow } from '../items/ItemRow';
// import './character2.css';

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
      <div className="main-container-section">
        <Container>
          <div className="card mt-card-top account-overview-games">
            <div className="card-title">
              <Row>
                <Col lg="auto">
                  <div>
                    <h3>{character.name}</h3>
                  </div>
                  <div>
                    <div>{character.player_class_name}</div>
                    <div className="CharacterHeader-detail">
                      {character.level}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
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
                  DPS:{' '}
                  {(
                    (character.min_damage + character.max_damage) /
                    2 /
                    (character.attack_speed / 1000)
                  ).toFixed(2)}
                </div>
              </div>
            </Col>
            <Col lg="auto">
              <div className="CharacterBody Character-stats">
                <div className="CharacterBody Character-stats damage">
                  DAMAGE RANGE: {character.min_damage}-{character.max_damage}
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
            <Col lg="auto">
              <div className="CharacterBody Character-stats">
                <div className="CharacterBody Character-stats damage">
                  ATTACK SPEED: {(character.attack_speed / 1000).toFixed(1)}s
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="auto">
              <h4>Inventory</h4>
              {character.inventory ? (
                <ul className="items-list">
                  {character.inventory.map(item => {
                    return (
                      <div key={item.id}>
                        <ItemRow item={item} />
                      </div>
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
      </div>
    </React.Fragment>
  );
};

export default Character;
