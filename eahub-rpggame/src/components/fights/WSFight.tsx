import React, { useState } from 'react';
import {
  Grid,
  Segment,
  Progress,
  Loader,
  Transition,
  List
} from 'semantic-ui-react';
import Sockette from 'sockette';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../store/Store';
let ws: Sockette;

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

export const getAttackText = (attack: any, enemy: any) => {
  const name = 'The enemy'; // enemy.en_race_name.toLowerCase();
  if (attack.is_missed) {
    return `You missed the ${name}.`;
  }
  if (attack.is_dodged) {
    return `The ${name} dodged your attack.`;
  }
  if (attack.is_blocked) {
    return `The ${name} blocked your attack you only hit them for ${attack.attack_amt} damage.`;
  }
  if (attack.is_critical) {
    return `You critically hit the ${name} for ${attack.attack_amt} damage!`;
  }

  return `You hit the ${name} for ${attack.attack_amt} damage.`;
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

  const defaultCharacter = useSelector((state: IApplicationState) => {
    return state.characters.defaultCharacter;
  });

  React.useEffect(() => {
    const socketUrl =
      'wss://eofvkzzz58.execute-api.us-east-2.amazonaws.com/dev';
    if (!ws && !connected) {
      ws = new Sockette(socketUrl, {
        onopen: e => {
          setConnected(true);
          console.log('Connected');
        },
        onclose: e => {
          setConnected(false);
        },
        onreconnect: e => {
          console.log('Reconnecting');
        },
        onmessage: e => {
          onMessageReceived(e);
        }
      });
      //   return () => {
      //     ws && ws.close();
      //   };
    }
  });
  //   React.useEffect(() => {
  //     ws && ws.close();
  //   }, []);

  const onMessageReceived = (message: MessageEvent) => {
    const data = JSON.parse(message.data);
    switch (data.message) {
      case 'FIGHT_STARTED':
        console.log(data.fight);
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
    // console.log(JSON.parse(JSON.parse(data).body).yourMessage);
  };
  const onStartFight = () => {
    if (defaultCharacter) {
      ws.json({
        action: 'startFight',
        char_id: defaultCharacter.id
      });
    }
  };

  const onAttack = () => {
    ws.json({
      action: 'playerAttack',
      fight_id: currentFight.id,
      char_id: currentFight.characters[0].id
    });
    setAttackActive(false);

    setTimeout(() => setAttackActive(true), character.attack_speed);
  };

  const onClaimLoot = () => {
    ws.json({
      action: 'claimLoot',
      fight_id: currentFight.id,
      char_id: currentFight.characters[0].id
    });
  };

  return (
    <div className="ui-container">
      <div>
        <button
          className="ui primary button"
          onClick={onStartFight}
          disabled={currentFight && currentFight.is_active}
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
                  <Progress
                    total={character.hit_points}
                    value={currentFightCharacter.curr_hp}
                    color={enemyHealthBarColor(
                      currentFightCharacter.curr_hp,
                      character.hit_points
                    )}
                  >
                    {currentFightCharacter.curr_hp}/{character.hit_points}
                  </Progress>
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <div>
                    {enemy.en_race_name} | {enemy.level}
                  </div>
                  <Progress
                    active={currentFight.enemy.status.toLowerCase() === 'alive'}
                    total={currentFight.enemy.base_hp}
                    value={currentFight.enemy.curr_hp}
                    color={enemyHealthBarColor(
                      currentFight.enemy.curr_hp,
                      currentFight.enemy.base_hp
                    )}
                  >
                    {currentFightEnemy.curr_hp}/{currentFightEnemy.base_hp}
                  </Progress>
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
                                  getAttackText(att, currentFightEnemy)}
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
