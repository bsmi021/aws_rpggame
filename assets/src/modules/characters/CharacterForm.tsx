import * as React from 'react';
import { FormGroup, Form, Button } from 'react-bootstrap';
import { API } from 'aws-amplify';

interface Props {}

interface IState {
  name: string;
  player_class: number;
}

export class CharacterForm extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      player_class: 0
    };
  }
}
