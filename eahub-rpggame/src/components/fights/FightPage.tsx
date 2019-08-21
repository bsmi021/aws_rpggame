import * as React from 'react';
import { RouteComponentProps, Prompt } from 'react-router-dom';
import Fight from './Fight';
import { getFight } from '../../actions/FightActions';
import { IFight } from '../../types/FightTypes';
import { IApplicationState } from '../../store/Store';
import { connect } from 'react-redux';

interface IProps extends RouteComponentProps<{ id: string }> {
  getFight: typeof getFight;
  loading: boolean;
  fight?: IFight;
}

export class FightPage extends React.Component<IProps> {
  public async componentDidMount() {
    this.props.getFight(this.props.match.params.id);
  }

  public render() {
    const fight = this.props.fight;
    return (
      <div className="ui container">
        <Prompt
          when={fight && fight.enemy.status.toLowerCase() === 'alive'}
          message="Are you sure you want to leave while this fight is active?"
        />
        {fight ? <Fight fight={fight} /> : <></>}
      </div>
    );
  }

  private navAwayMessage = () => {
    'Are you sure you want to leave while this fight is still active?';
  };
}

const mapStateToProps = (store: IApplicationState) => {
  return {
    loading: store.fights.fightsLoading,
    fight: store.fights.currentFight || undefined
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getFight: (id: string) => dispatch(getFight(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FightPage);
