import * as React from 'react';
import { IEnemy } from '../../types/EnemyTypes';
import { IApplicationState } from '../../store/Store';
import { getEnemy } from '../../actions/EnemyActions';
import { ThunkDispatch } from 'redux-thunk';
import { connect, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Segment, Progress } from 'semantic-ui-react';
import { IFight } from '../../types/FightTypes';
import { enemyHealthBarColor } from './fightUtils';

interface IProps {
  enemy?: IEnemy;
  fight?: IFight;
}

export const FightEnemyNameplate: React.FunctionComponent<IProps> = props => {
  const enemy = props.enemy;
  const fight = props.fight;
  if (!enemy) {
    return null;
  }

  if (!fight) {
    return null;
  }

  return (
    <React.Fragment>
      <Segment>
        {enemy.en_race_name} | {enemy.level}
        <Progress
          active={fight.enemy.status.toLowerCase() === 'alive'}
          total={fight.enemy.base_hp}
          value={fight.enemy.curr_hp}
          color={enemyHealthBarColor(fight.enemy.curr_hp, fight.enemy.base_hp)}
        >
          {fight.enemy.curr_hp}/{fight.enemy.base_hp}
        </Progress>
      </Segment>
    </React.Fragment>
  );
};

export default FightEnemyNameplate;
