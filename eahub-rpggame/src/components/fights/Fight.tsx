import * as React from 'react';
import { IApplicationState } from '../../store/Store';
import { IFight, IAttack } from '../../types/FightTypes';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, List, Transition } from 'semantic-ui-react';
import { fightsReducer } from '../../reducers/FightReducer';
import { attack } from '../../actions/FightActions';

interface IProps {
  fight?: IFight;
}

export const Fight: React.FunctionComponent<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const [interval, setIntervalState] = React.useState();

  // React.useEffect(() => {
  //   setIntervalState(
  //     setInterval(() => {

  //       if (fight && !fight.is_active) {
  //         setIntervalState(undefined);
  //       }
  //       if (fight) {
  //         console.log(fight.enemy.curr_hp);
  //       }
  //     }, 1000)
  //   );
  //   return () => {
  //     setIntervalState(undefined);
  //   };
  // }, []);

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

  return (
    <div className="ui container">
      <Grid container={true} stackable={false} celled={true}>
        <Grid.Row>
          <Grid.Column>
            <div>
              {fight.enemy.id} | {fight.enemy.curr_hp}
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <button
              className="ui button primary"
              disabled={!attackActive || !fight.is_active}
              onClick={e => {
                e.preventDefault();

                if (currentCharacter) {
                  dispatch(attack(currentCharacter.id, fight.id));
                  setAttackActive(false);

                  setTimeout(
                    () => setAttackActive(true),
                    currentCharacter.attack_speed
                  );
                }
              }}
            >
              Attack!
            </button>
          </Grid.Column>
          <Grid.Column>
            <Transition.Group
              as={List}
              duration={200}
              divided={true}
              relaxed={true}
              animation="drop"
            >
              {attacks
                .filter((a: IAttack) => a.fight_id === fight.id)
                .map(att => {
                  return (
                    <List.Item key={att.id}>
                      <List.Description>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column>{att.attack_amt}</Grid.Column>
                            <Grid.Column>
                              {att.is_critical && <div>Crit</div>}
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </List.Description>
                    </List.Item>
                  );
                })}
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Fight;
