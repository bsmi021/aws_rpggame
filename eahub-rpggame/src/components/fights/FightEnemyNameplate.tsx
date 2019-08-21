import * as React from 'react';
import { IEnemy } from '../../types/EnemyTypes';
import { IApplicationState } from '../../store/Store';
import { getEnemy } from '../../actions/EnemyActions';
import { ThunkDispatch } from 'redux-thunk';
import { connect, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';

interface IProps {
  enemy?: IEnemy;
}

export const FightEnemyNameplate: React.FunctionComponent<IProps> = props => {
  const enemy = props.enemy;

  if (!enemy) {
    return null;
  }

  return (
    <div>
      {enemy.en_race_name} | {enemy.level}
    </div>
  );
};

export default FightEnemyNameplate;
