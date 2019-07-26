import React from 'react';
import { API } from 'aws-amplify';
import { RouteComponentProps } from 'react-router-dom';
import { IItem } from './ItemType';
import Item from './Item';

type Props = RouteComponentProps<{ id: string }>;

interface IState {
  item?: IItem;
}

export class ItemPage extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      await API.get('items', `/items/${this.props.match.params.id}`, null)
        .then(response => {
          this.setState({ item: response });
        })
        .catch(error => alert(error));
    }
  }

  render() {
    const item = this.state.item;

    return (
      <div className="page-container">
        {item ? (
          <div className="white-box">
            <Item item={item} />
          </div>
        ) : (
          <p>Item not found!</p>
        )}
      </div>
    );
  }
}

export default ItemPage;
