import * as React from 'react';
import { ICharacter } from './CharacterType';
import { Row, Container, Col, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Item from '../items/Item';
import './character.css';
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
            <Card className="card">
              <Card.Body className="card card-body">
                <Card.Title className="card card-title">DPS</Card.Title>
                <Card.Text>
                  {(
                    (character.min_damage + character.max_damage) /
                    2 /
                    (character.attack_speed / 1000)
                  ).toFixed(1)}
                </Card.Text>
              </Card.Body>
            </Card>

            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>Health</Card.Title>
                <Card.Subtitle>Total hitpoints</Card.Subtitle>
                <Card.Text>{character.hit_points}</Card.Text>
              </Card.Body>
            </Card>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>Damage Range</Card.Title>
                <Card.Subtitle>Range of normal attacks</Card.Subtitle>
                <Card.Text>
                  {character.min_damage}-{character.max_damage}
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
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
      </div>
    </React.Fragment>
  );
};

export default Character;
