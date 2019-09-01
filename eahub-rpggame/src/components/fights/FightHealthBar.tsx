import * as React from 'react';
import { Progress } from 'semantic-ui-react';
import { enemyHealthBarColor } from './fightUtils';

export interface IProps {
  totalHP: number;
  currHP: number;
  status: string;
}

const FightHealthBar: React.SFC<IProps> = props => {
  return (
    <Progress
      active={props.status.toLowerCase() === 'alive'}
      total={props.totalHP}
      value={props.currHP}
      color={enemyHealthBarColor(props.currHP, props.totalHP)}
    >
      {props.currHP}/{props.totalHP}
    </Progress>
  );
};

export default FightHealthBar;
