import * as React from 'react';
import { IApplicationState } from '../../store/Store';
import { IFight, IAttack } from '../../types/FightTypes';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  List,
  Transition,
  Segment,
  Progress,
  Loader
} from 'semantic-ui-react';
import { fightsReducer } from '../../reducers/FightReducer';
import { attack } from '../../actions/FightActions';
import { enemyHealthBarColor } from './fightUtils';
import { FightEnemyNameplate } from './FightEnemyNameplate';

interface IProps {
  fight?: IFight;
}

export const Fight: React.FunctionComponent<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const [interval, setIntervalState] = React.useState();
  const enemy = useSelector((state: IApplicationState) => {
    return state.fights.currentFightEnemy;
  });
  // React.useEffect(() => {
  //   setIntervalState(
  //     setInterval(() => {
  //       if (props.fight && !props.fight.is_active) {
  //         //setIntervalState(undefined);
  //       }
  //       if (props.fight) {
  //         console.log(props.fight.enemy.curr_hp);
  //       }
  //     }, 1000)
  //   );
  //   return () => {
  //     setIntervalState(undefined);
  //   };
  // }, [interval, props.fight]);

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
            <div>
              <Segment>
                {enemy && <FightEnemyNameplate enemy={enemy} />}
              </Segment>

              <Segment>
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
            </div>
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
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment
              className="ui centered container "
              style={{
                overflowY: 'scroll',
                overflowX: 'scroll',
                flex: 1,
                background: 'lightgrey',
                width: '100%',
                outerHeight: '300px'
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
                  .filter((a: IAttack) => a.fight_id === fight.id)
                  .sort((a: IAttack, b: IAttack) =>
                    a.attack_ts > b.attack_ts ? -1 : 1
                  )
                  .map(att => {
                    return (
                      <List.Item key={att.id} style={{ width: '100%' }}>
                        <List.Description>
                          <span>{att.attack_ts} | </span>

                          <span>{att.attack_amt} | </span>

                          <span>{att.is_critical ? 'Crit' : 'Reg.'} | </span>
                        </List.Description>
                      </List.Item>
                    );
                  })}
              </Transition.Group>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Fight;
