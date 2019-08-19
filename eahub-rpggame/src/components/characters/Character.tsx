import * as React from 'react';
import { ICharacter, CharacterClasses } from '../../types/CharacterTypes';
import withLoader from '../common/withLoader';
import { Grid, Tab, Card } from 'semantic-ui-react';
import ItemCardSmall from '../items/ItemCardSmall';
import { IItem } from '../../types/ItemTypes';
import { classIcon, calcDps, isMyCharacter } from './charUtils';
import { setDefaultCharacter } from '../../actions/CharacterActions';

import { useSelector, connect } from 'react-redux';
import { IApplicationState } from '../../store/Store';

interface IProps {
  character?: ICharacter;
  loading: boolean;
  setDefaultCharacter: typeof setDefaultCharacter;
}

const Character: React.FunctionComponent<IProps> = props => {
  const character = props.character;

  const userId: string =
    useSelector((state: IApplicationState) => {
      return state.auth.userId;
    }) || '';

  const defaultCharacterId: string =
    useSelector((state: IApplicationState) => {
      return state.characters.defaultCharacter
        ? state.characters.defaultCharacter.id
        : '';
    }) || '';

  const historyPane = () => {
    if (!character) {
      return null;
    }
    return (
      <div>
        {character.inventory ? (
          <Card.Group stackable={true}>
            {character.inventory.map((item: IItem) => {
              return <ItemCardSmall key={item.id} item={item} />;
            })}
          </Card.Group>
        ) : null}
      </div>
    );
  };

  const panes = [
    {
      menuItem: 'Inventory',
      render: () => <Tab.Pane attached={false}>{historyPane()}</Tab.Pane>
    },
    {
      menuItem: 'History',
      render: () => <Tab.Pane attached={false}>History</Tab.Pane>
    }
  ];

  if (!character) {
    return null;
  }

  return (
    <React.Fragment>
      <div>
        <Grid celled={true} container={true} stackable={false}>
          <Grid.Row color="black">
            <Grid.Column width={5}>
              <span>
                <div
                  style={{
                    background: 'white',
                    width: '50px',
                    height: '50px',
                    float: 'left'
                  }}
                >
                  <img
                    src={`${classIcon(character.player_class_name)}`}
                    style={{ height: '50px', width: '50px' }}
                  />
                </div>
                <h2
                  style={{
                    float: 'left',
                    marginLeft: '10px',
                    verticalAlign: 'middle'
                  }}
                >
                  {character.name}
                </h2>
              </span>
            </Grid.Column>
            <Grid.Column width={10}>
              <h4>{character.player_class_name}</h4>
              {isMyCharacter(character.account, userId) &&
                character.id !== defaultCharacterId && (
                  <button
                    className="ui mini button left floated"
                    onClick={e => {
                      e.preventDefault();
                      props.setDefaultCharacter(props.character);
                    }}
                  >
                    <i className={`user icon`} />
                    Make Default
                  </button>
                )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns="equal" color="grey">
            <Grid.Column>
              <span>Health: {character.hit_points}</span>
            </Grid.Column>
            <Grid.Column>
              <span>DPS: {calcDps(character)}/s</span>
            </Grid.Column>
            <Grid.Column>
              <div>
                Damage Range: {character.min_damage}-{character.max_damage}
              </div>
            </Grid.Column>
            <Grid.Column>
              <div>Critical Strike %: {character.crit_chance}</div>
            </Grid.Column>
            <Grid.Column>
              <div>
                Attack Speed: {(character.attack_speed / 1000).toFixed(1)}s
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Tab menu={{ secondary: true }} panes={panes} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default withLoader(Character);
