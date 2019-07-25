import React from 'react';
import { ItemPage } from './ItemPage';
import { API } from 'aws-amplify';
import { IItem } from './ItemType';
import { Link, RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';

interface ItemsProps {}

interface ItemsState {
  items: IItem[];
}

export class Items extends React.Component<RouteComponentProps, ItemsState> {
  public static getDerivedStateFromProps(
    props: RouteComponentProps,
    state: ItemsState
  ) {
    return {
      items: state.items
    };
  }
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      items: []
    };
  }

  componentDidMount() {
    API.get('items', '/items', null)
      .then(response => {
        this.setState({
          items: response.items
        });
      })
      .catch(error => alert(error));
  }

  render() {
    return (
      <div className="well-bs no-padding-top col-md-12 no-border">
        <div className="container-category">
          <h3>Inventory Items</h3>
        </div>
        <ul className="items-list">
          {this.state.items.map(item => {
            return (
              <li key={item.id}>
                <p>
                  <Link to={`/items/${item.id}`}>{item.name}</Link>:{' '}
                  {item.slot_name}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Items;
