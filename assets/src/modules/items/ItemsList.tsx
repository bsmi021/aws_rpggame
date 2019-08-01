import React from 'react';
import { API } from 'aws-amplify';
import { IItem } from './ItemType';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { ItemRow } from './ItemRow';

interface ItemsProps {}

interface ItemsState {
  items: IItem[];
}

export class ItemsList extends React.Component<
  RouteComponentProps,
  ItemsState
> {
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
        {this.state.items.map(item => {
          return (
            <div key={item.id}>
              <ItemRow item={item} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default ItemsList;
