import React, { useState, useCallback } from 'react';
import {
  Grid,
  Segment,
  Progress,
  Loader,
  Transition,
  List
} from 'semantic-ui-react';
import useWebSocket from 'react-use-websocket';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import config from '../../config';
import FightHealthBar from './FightHealthBar';
// let ws: Sockette;

const CONNECTION_STATUS_CONNECTING = 0;
const CONNECTION_STATUS_OPEN = 1;
const CONNECTION_STATUS_CLOSING = 2;
const CONNECTION_STATUS_CLOSED = 3;

const connectionStates = (readyState: number) => {
  switch (readyState) {
    case CONNECTION_STATUS_CONNECTING:
      return 'Connecting';
      break;
    case CONNECTION_STATUS_OPEN:
      return 'Open';
      break;
    case CONNECTION_STATUS_CLOSING:
      return 'Closing';
    case CONNECTION_STATUS_CLOSED:
      return 'Closed';
    default:
      return 'Undefined';
  }
  // [CONNECTION_STATUS_CONNECTING]: 'Connecting',
  // [CONNECTION_STATUS_OPEN]: 'Open',
  // [CONNECTION_STATUS_CLOSING]: 'Closing',
  // [CONNECTION_STATUS_CLOSED]: 'Closed',}
};

export const enemyHealthBarColor = (currHp: number, baseHp: number) => {
  const enemyLifeLeftPct = currHp / baseHp;

  if (enemyLifeLeftPct > 0.66) {
    return 'green';
  } else if (enemyLifeLeftPct > 0.33) {
    return 'yellow';
  } else if (enemyLifeLeftPct > 0.17) {
    return 'orange';
  } else if (enemyLifeLeftPct > 0) {
    return 'red';
  } else {
    return 'grey';
  }
};

export const getAttackText = (attack: any, enemy: any, character: any) => {
  let sourceName = '';
  let targetName = '';
  if (attack.source_tp === 'C') {
    sourceName = character.name;
    targetName = enemy.en_race_name;
  } else {
    sourceName = enemy.en_race_name;
    targetName = character.name;
  }

  if (attack.is_missed) {
    return `${sourceName}'s attack missed ${targetName}.`;
  }
  if (attack.is_dodged) {
    return `${targetName} dodged ${sourceName}'s attack.`;
  }
  if (attack.is_blocked) {
    return `${targetName} blocked ${sourceName}'s attack, ${attack.attack_amt} damage.`;
  }
  if (attack.is_critical) {
    return `${sourceName} critically hit ${targetName} for ${attack.attack_amt} damage!`;
  }

  return `${sourceName} hit ${targetName} for ${attack.attack_amt} damage.`;
};

const WSFight: React.FC = () => {
  const [connected, setConnected] = React.useState(false);
  const [currentFight, setCurrentFight] = React.useState();
  const [currentFightEnemy, setCurrentFightEnemy] = React.useState();
  const [xpEarned, setXpEarned] = React.useState();
  const [currentFightCharacter, setCurrentFightCharacter] = React.useState();
  const [loot, setLoot] = React.useState();
  const [lootClaimed, setLootClaimed] = React.useState(false);
  const [leveledUp, setLeveledUp] = React.useState(false);
  const [currLevel, setCurrLevel] = React.useState();
  const [prevLevel, setPrevLevel] = React.useState();
  const [attackActive, setAttackActive] = React.useState(true);
  const [attacks, setAttacks] = React.useState([] as any);
  const [fightLoaded, setfightLoaded] = React.useState(false);
  const [character, setCharacter] = useState(); // used to display non fight info
  const [enemy, setEnemy] = useState(); // used to display non fight info

  const [messageHistory, setMessageHistory] = useState([]);
  const [sendMessage, lastMessage, readyState] = useWebSocket(
    config.apiGateway.FIGHT_AGGR_WS_URL
  );

  const defaultCharacter = useSelector((state: IApplicationState) => {
    return state.characters.defaultCharacter;
  });

  React.useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
      onMessageReceived(lastMessage);
    }
  }, [lastMessage]);

  const connectionStatus = connectionStates(readyState);

  const onMessageReceived = (message: MessageEvent) => {
    const data = JSON.parse(message.data);
    switch (data.message) {
      case 'FIGHT_STARTED':
        setCurrentFight(data.fight);
        setCharacter(data.character);
        setEnemy(data.enemy);
        setCurrentFightEnemy(data.fight.enemy);
        setCurrentFightCharacter(data.fight.characters[0]);
        setLootClaimed(false);
        setLoot(null);
        setPrevLevel(null);
        setCurrLevel(null);
        setXpEarned(null);
        setAttacks([]);
        setfightLoaded(true);
        break;
      case 'ATTACK_SUCCESS':
        setCurrentFight(data.fight);
        setCurrentFightEnemy(data.fight.enemy);
        setCurrentFightCharacter(data.fight.characters[0]);
        setAttacks((attacks: any) => [...attacks, data.attack]);
        break;
      case 'FIGHT_ENDED':
        setCurrentFight(data.fight);
        setCurrentFightEnemy(data.fight.enemy);
        setCurrentFightCharacter(data.character);
        break;
      case 'XP_EARNED':
        setXpEarned(data.xp_earned);
        setLeveledUp(data.prev_level > data.curr_level);
        setCurrLevel(data.curr_level);
        setPrevLevel(data.prev_level);
        break;
      case 'ENEMY_ATTACK':
        setCurrentFight(data.fight);
        setCurrentFightEnemy(data.fight.enemy);
        setCurrentFightCharacter(data.fight.characters[0]);
        setAttacks((attacks: any) => [...attacks, data.attack]);
        break;
      case 'LOOT':
        setLoot(data.loot_item);
        break;
      case 'LOOT_CLAIMED':
        setLoot(null);
        setLootClaimed(true);
        break;
      default:
        break;
    }
  };
  const onStartFight = () => {
    if (defaultCharacter) {
      sendMessage(
        JSON.stringify({
          action: 'startFight',
          char_id: defaultCharacter.id
        })
      );
    }
  };

  const onAttack = () => {
    sendMessage(
      JSON.stringify({
        action: 'playerAttack',
        fight_id: currentFight.id,
        char_id: currentFight.characters[0].id
      })
    );
    setAttackActive(false);

    setTimeout(() => setAttackActive(true), character.attack_speed);
  };

  const onClaimLoot = () => {
    sendMessage(
      JSON.stringify({
        action: 'claimLoot',
        fight_id: currentFight.id,
        char_id: currentFight.characters[0].id
      })
    );
  };

  return (
    <div className="ui container">
      <div>
        <button
          className="ui primary button"
          onClick={onStartFight}
          disabled={
            readyState === 1 && (currentFight && currentFight.is_active)
          }
        >
          Start
        </button>
      </div>
      {fightLoaded && currentFight && (
        <div className="ui container">
          <Grid container={true} stackable={true} celled={true}>
            <Grid.Row columns={'equal'}>
              <Grid.Column>
                <Segment>
                  <div>
                    {character.name} | {character.level}
                  </div>
                  <FightHealthBar
                    totalHP={currentFightCharacter.base_hp}
                    currHP={currentFightCharacter.curr_hp}
                    status={currentFightCharacter.status}
                  />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <div>
                    {enemy.en_race_name} | {enemy.level}
                  </div>
                  <FightHealthBar
                    totalHP={currentFightEnemy.base_hp}
                    currHP={currentFightEnemy.curr_hp}
                    status={currentFightEnemy.status}
                  />
                </Segment>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <div>
                  {xpEarned ? `You earned ${xpEarned} experience points!` : ``}
                  <br />
                  {leveledUp ? `You reached level ${currLevel}` : ``}
                </div>
                {loot && (
                  <div>
                    You've got some loot {loot.name}
                    <button disabled={lootClaimed} onClick={onClaimLoot}>
                      Claim that loot
                    </button>
                  </div>
                )}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns="equal" stretched={true}>
              <Grid.Column width={16}>
                <button
                  className="ui button primary"
                  disabled={!attackActive || !currentFight.is_active}
                  onClick={onAttack}
                >
                  <div>
                    <Loader active={!attackActive} size="mini" />
                    Attack!
                  </div>
                </button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row stretched={true}>
              <Grid.Column width={16}>
                <Segment className="ui centered container ">
                  <div
                    style={{
                      maxHeight: '25em',
                      height: '25em',
                      overflow: 'auto'
                    }}
                  >
                    <Transition.Group
                      as={List}
                      duration={500}
                      divided={true}
                      relaxed={true}
                      animation="slide left"
                    >
                      {attacks
                        .filter((a: any) => a.fight_id === currentFight.id)
                        .sort((a: any, b: any) =>
                          a.attack_ts > b.attack_ts ? -1 : 1
                        )
                        .map((att: any) => {
                          return (
                            <List.Item key={att.id} style={{ width: '100%' }}>
                              <List.Description>
                                {currentFightEnemy &&
                                  getAttackText(att, enemy, character)}
                              </List.Description>
                            </List.Item>
                          );
                        })}
                    </Transition.Group>
                  </div>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )}
    </div>
  );
};

export default WSFight;
