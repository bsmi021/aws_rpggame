import * as React from 'react';
import { RouteComponentProps, Prompt } from 'react-router';
import WSFight from './WSFight';

interface IProps extends RouteComponentProps {}

export class WSFightPage extends React.Component<IProps> {
  public render() {
    return (
      <div className="ui container">
        <WSFight />
      </div>
    );
  }

  private navAwayMessage = () => {
    'Are you sure you want to leave while this fight is still active?';
  };
}

export default WSFightPage;
