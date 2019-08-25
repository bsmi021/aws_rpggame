import * as React from 'react';
import { IApplicationState } from '../../store/Store';
import { IFight, IAttack, IFightState } from '../../types/FightTypes';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  List,
  Transition,
  Segment,
  Progress,
  Loader,
  Modal
} from 'semantic-ui-react';
import { attack, getFight, claimLoot } from '../../actions/FightActions';
import { enemyHealthBarColor, getAttackText } from './fightUtils';
import { FightEnemyNameplate } from './FightEnemyNameplate';

interface IProps {
  fight?: IFight;
}

export const Fight: React.FunctionComponent<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const enemy = useSelector((state: IApplicationState) => {
    return state.fights.currentFightEnemy;
  });
  // const fight = useSelector((state: IFightState) => {
  //   return state.currentFight;
  // });

  const [attackActive, setAttackActive] = React.useState(true);

  const currentCharacter = useSelector((store: IApplicationState) => {
    return store.characters.defaultCharacter;
  });

  const attacks = useSelector(
    (store: IApplicationState) => store.fights.attacks
  );

  const fight = props.fight;
  if (!fight) {
    return null;
  }

  if (!currentCharacter) {
    return null;
  }

  const onAttackClick = (e: any) => {
    e.preventDefault();

    if (currentCharacter) {
      dispatch(attack(currentCharacter.id, fight.id));
      setAttackActive(false);

      setTimeout(() => setAttackActive(true), currentCharacter.attack_speed);
    }
  };

  return (
    <div className="ui container">
      <Grid container={true} stackable={true} celled={true}>
        <Grid.Row>
          <Grid.Column>
            <Grid>
              <Grid.Row stretched={true}>
                <Grid.Column width={8}>
                  <Segment>
                    <div>
                      {currentCharacter.name} | {currentCharacter.level}
                    </div>
                    <Progress
                      total={currentCharacter.hit_points}
                      value={
                        fight.characters.filter(
                          x => x.id === currentCharacter.id
                        )[0].curr_hp
                      }
                      color="green"
                    />
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Segment>
                    {enemy && <FightEnemyNameplate enemy={enemy} />}
                    <Progress
                      active={fight.enemy.status.toLowerCase() === 'alive'}
                      total={fight.enemy.base_hp}
                      value={fight.enemy.curr_hp}
                      color={enemyHealthBarColor(
                        fight.enemy.curr_hp,
                        fight.enemy.base_hp
                      )}
                    >
                      {fight.enemy.curr_hp}/{fight.enemy.base_hp}
                    </Progress>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Segment>
              {!fight.is_active && (
                <Modal
                  trigger={
                    <button
                      className="ui button primary"
                      onClick={e => {
                        dispatch(getFight(fight.id));
                      }}
                    >
                      <i className="icon trophy centered" />
                    </button>
                  }
                >
                  <Modal.Header>You've got loot</Modal.Header>
                  <Modal.Description>
                    {currentCharacter &&
                      fight.characters.filter(
                        i => i.id === currentCharacter.id
                      )[0] && (
                        <div>
                          {
                            fight.characters.filter(
                              i => i.id === currentCharacter.id
                            )[0].loot_item_id
                          }
                          {!fight.characters.filter(
                            i => i.id === currentCharacter.id
                          )[0].loot_claimed && (
                            <button
                              className="ui button primary"
                              onClick={e => {
                                dispatch(claimLoot(fight.id));
                              }}
                            >
                              Claim the Loot
                            </button>
                          )}
                        </div>
                      )}
                  </Modal.Description>
                </Modal>
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns="equal" stretched={true}>
          <Grid.Column width={16}>
            <button
              className="ui button primary"
              disabled={!attackActive || !fight.is_active}
              onClick={onAttackClick}
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
                style={{ maxHeight: '150%', height: 'auto', overflow: 'auto' }}
              >
                <Transition.Group
                  as={List}
                  duration={500}
                  divided={true}
                  relaxed={true}
                  animation="slide left"
                >
                  {attacks
                    .filter((a: IAttack) => a.fight_id === fight.id)
                    .sort((a: IAttack, b: IAttack) =>
                      a.attack_ts > b.attack_ts ? -1 : 1
                    )
                    .map(att => {
                      return (
                        <List.Item key={att.id} style={{ width: '100%' }}>
                          <List.Description>
                            {enemy && getAttackText(att, enemy)}
                          </List.Description>
                        </List.Item>
                      );
                    })}
                </Transition.Group>
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row />
      </Grid>
    </div>
  );
};

export default Fight;
