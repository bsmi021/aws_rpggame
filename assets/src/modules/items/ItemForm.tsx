import * as React from 'react';
import { IItem } from './ItemType';
import {
  FormGroup,
  FormControl,
  Form,
  FormLabel,
  Button
} from 'react-bootstrap';
import { API } from 'aws-amplify';
import { Redirect } from 'react-router';

interface Props {}

interface IState {
  name: string;
  description: string;
  quality: string;
  slot: string;
  damage: string;
  stamina: string;
  crit_chance: string;
  item?: IItem;
  isLoading: boolean;
  toConfirm: boolean;
  shouldRedirect: boolean;
}

export class ItemForm extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      slot: '1',
      quality: '1',
      damage: '10',
      stamina: '10',
      crit_chance: '0.02',
      isLoading: true,
      toConfirm: false,
      shouldRedirect: false
    };
  }

  async componentDidMount() {}

  handleChange = (event: any) => {
    const target = event.target as HTMLInputElement;
    this.setState({
      ...this.state,
      [target.name as any]: target.value
    });
  };

  handleNumberChange = (event: any) => {
    const target = event.target as HTMLInputElement;
    const re: RegExp = /^[0-9.,]+$/;
    if (target.value === '' || re.test(target.value))
      this.setState({
        ...this.state,
        [target.name as any]: target.value
      });
  };

  onSubmit = () => {
    const item = this.state;

    var myInit = {
      body: {
        name: item.name,
        description: item.description,
        quality: Number(item.quality),
        slot: Number(item.slot),
        damage: Number(item.damage),
        stamina: Number(item.stamina),
        crit_chance: Number(item.crit_chance) * 0.01
      }
    };

    API.post('items', '/items', myInit)
      .then(response => {
        this.setState({ item: response });
      })
      .catch(error => alert(error));
  };

  render = () => {
    return (
      <div className="well-bs col-md-12 full-page no-padding-top">
        <div className="white-box no-margin-top">
          <Form onSubmit={this.onSubmit}>
            <div className="form-row">
              <FormGroup controlId="name_description">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  name="description"
                  type="text"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
                <Form.Label>Quality: </Form.Label>
                <Form.Control
                  name="quality"
                  type="text"
                  value={this.state.quality}
                  onChange={this.handleNumberChange}
                />
                <Form.Label>Slot: </Form.Label>
                <Form.Control
                  name="slot"
                  type="text"
                  value={this.state.slot}
                  onChange={this.handleNumberChange}
                />
                <Form.Label>Damage: </Form.Label>
                <Form.Control
                  name="damage"
                  type="text"
                  value={this.state.damage}
                  onChange={this.handleNumberChange}
                />
                <Form.Label>Stamina: </Form.Label>
                <Form.Control
                  name="stamina"
                  type="text"
                  value={this.state.stamina}
                  onChange={this.handleNumberChange}
                />
                <Form.Label>Critical Strike Chance: </Form.Label>
                <Form.Control
                  name="crit_chance"
                  type="text"
                  value={this.state.crit_chance}
                  onChange={this.handleNumberChange}
                />
                <Button onClick={this.onSubmit}>Submit</Button>
              </FormGroup>
            </div>
          </Form>
        </div>
      </div>
    );
  };
}

export default ItemForm;
