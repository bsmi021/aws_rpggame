import * as React from 'react';
import { IApplicationState } from '../../store/Store';
import { IFight } from '../../types/FightTypes';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { fightsReducer } from '../../reducers/FightReducer';
import { attack } from '../../actions/FightActions';

interface IProps {
  fight?: IFight;
}

export const Fight: React.FunctionComponent<IProps> = (props: IProps) => {
  const dispatch = useDispatch();

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
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <div>
              {fight.enemy.id} | {fight.enemy.curr_hp}
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <button
              className="ui button primary"
              disabled={!attackActive && !fight.is_active}
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
            <ul>
              {attacks.map(att => {
                return (
                  <li key={att.id}>
                    {att.attack_amt} | {att.is_critical}
                  </li>
                );
              })}
            </ul>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Fight;
