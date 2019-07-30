import React from 'react';
import { API } from 'aws-amplify';
import { IItem } from './ItemType';
import { Link, RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { Card, Container } from 'react-bootstrap';

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
        {this.state.items.map(item => {
          return (
            <div key={item.id}>
              <Link to={`/items/${item.id}`}>
                <Card key={item.id} className="item-card">
                  <Card.Title className="item-card-title">
                    {item.name}
                  </Card.Title>
                  <Card.Subtitle>{item.slot_name}</Card.Subtitle>
                  <Card.Body>
                    <div>{item.description}</div>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Items;
