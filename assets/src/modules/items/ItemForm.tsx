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

interface Props {}

interface IState {
  name: string;
  description: string;
  quality: number;
  slot: string;
  damage: number;
  stamina: number;
  crit_chance: number;
  item?: IItem;
  isLoading: boolean;
  toConfirm: boolean;
}

export class ItemForm extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      slot: '1',
      quality: 1,
      damage: 10,
      stamina: 10,
      crit_chance: 0.02,
      isLoading: true,
      toConfirm: false
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

  onSubmit = () => {
    const item = this.state;

    var myInit = {
      body: {
        name: item.name,
        description: item.description,
        quality: 1, //item.quality,
        slot: 2, // item.slot,
        damage: 30, //item.damage,
        stamina: 20, //item.stamina,
        crit_chance: 0.22 //item.crit_chance
      }
    };

    alert(JSON.stringify(myInit));

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
