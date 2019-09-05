import * as React from 'react';
import {
  ICharacter,
  ICharacterInventoryItem
} from '../../types/CharacterTypes';
import withLoader from '../common/withLoader';
import {
  Grid,
  Tab,
  Card,
  Progress,
  Header,
  Dropdown,
  Form
} from 'semantic-ui-react';
import CharacterItemCardSmall from './CharacterItemCardSmall';
import { classIcon, calcDps, isMyCharacter } from './charUtils';
import { setDefaultCharacter } from '../../actions/CharacterActions';
import { firstBy } from 'thenby';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import { startFight } from '../../actions/FightActions';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Redirect } from 'react-router';
import './styles/character.css';
import { label } from '@aws-amplify/ui';
import CharacterXPBar from './CharacterXPBar';

interface IProps {
  character?: ICharacter;
  loading: boolean;
  setDefaultCharacter: typeof setDefaultCharacter;
}

const Character: React.FunctionComponent<IProps> = props => {
  const character = props.character;
  const dispatch = useDispatch();

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

  const inventoryPane = () => {
    if (!character) {
      return null;
    }
    return (
      <Grid style={{ height: '40em', overflow: 'auto' }}>
        {character.inventory ? (
          <Grid.Row columns="equal">
            <Grid.Column>
              <Header>Bag:</Header>
              <Card.Group
                stackable={true}
                style={{ overflow: 'auto', height: '37em' }}
              >
                {character.inventory
                  .filter(a => !a.equipped)
                  .sort(
                    firstBy(s => s.slot, { direction: -1 }).thenBy(
                      s => s.quality,
                      { direction: -1 }
                    )
                  )
                  .map((item: ICharacterInventoryItem) => {
                    return (
                      <CharacterItemCardSmall
                        key={item.inv_id}
                        item={item}
                        charId={character.id}
                        isCurrentChar={defaultCharacterId === character.id}
                      />
                    );
                  })}
              </Card.Group>
            </Grid.Column>

            <Grid.Column>
              <Header>Equipped</Header>
              <Card.Group
                stackable={true}
                style={{ overflow: 'auto', height: '37em' }}
              >
                {character.inventory
                  .filter(a => a.equipped)
                  .sort(firstBy(s => s.slot))
                  .map((item: ICharacterInventoryItem) => {
                    return (
                      <CharacterItemCardSmall
                        key={item.inv_id}
                        item={item}
                        charId={character.id}
                        isCurrentChar={defaultCharacterId === character.id}
                      />
                    );
                  })}
              </Card.Group>
            </Grid.Column>
          </Grid.Row>
        ) : null}
      </Grid>
    );
  };

  const panes = [
    {
      menuItem: 'Inventory',
      render: () => <Tab.Pane attached={false}>{inventoryPane()}</Tab.Pane>
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
    <Grid celled={true} container={true} stackable={false}>
      <Grid.Row style={{ background: '#0D4067' }}>
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
                style={{ height: '50px', width: '50px', color: 'white' }}
                alt={character.player_class_name}
              />
            </div>
            <div
              style={{
                float: 'left',
                marginLeft: '10px',
                verticalAlign: 'middle',
                color: 'white'
              }}
            >
              <h2 style={{ marginBottom: '2px' }}>{character.name}</h2>
              <h4 style={{ marginTop: '2px' }}>
                Level {character.level} {character.player_class_name}
              </h4>
            </div>
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
          </span>
        </Grid.Column>
        <Grid.Column width={10}>
          <div style={{ color: 'white' }}>
            Experience Points:
            <br />
            <CharacterXPBar character={character} />
            {`${character.curr_lvl_xp}/${character.xp_to_lvl}`}
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns="equal">
        <Grid.Column>
          <div style={{ alignContent: 'center', textAlign: 'center' }}>
            <div style={{ color: 'green' }}>{character.hit_points}</div>
            <div>Health</div>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div className="character statbox">
            <div className="character statbox dps">{calcDps(character)}</div>
            <div>DPS</div>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div className="character statbox">
            <div>
              {character.min_damage}-{character.max_damage}
            </div>
            <div>Damage</div>
          </div>
        </Grid.Column>
        <Grid.Column className="column stats">
          <div className="character statbox">
            <div className="character statbox crit">
              {Math.round(character.crit_chance * 100)}%
            </div>
            <div>Crit.</div>
          </div>
        </Grid.Column>
        <Grid.Column>
          <div className="character statbox">
            <div>{(character.attack_speed / 1000).toFixed(1)}s</div>
            Speed
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Tab menu={{ secondary: true }} panes={panes} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Character;
