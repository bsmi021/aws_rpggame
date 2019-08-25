import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { getFight, startFight } from '../../actions/FightActions';
import { IFight, IFightState } from '../../types/FightTypes';
import Fight from './Fight';
import { Portal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

// interface IProps extends RouteComponentProps<{ id: string }> {
//   getFight: typeof getFight;
//   loading: boolean;
//   fight?: IFight;
// }

export const FightPortal: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [fight, setFight] = React.useState(
    useSelector((state: IFightState) => {
      return state.currentFightEnemy;
    })
  );

  const handleOpen = () => {
    if (!fight) {
      dispatch(startFight());
    }
  };

  return (
    <Portal onOpen={handleOpen}>
      <Fight />
    </Portal>
  );
};

export default FightPortal;
