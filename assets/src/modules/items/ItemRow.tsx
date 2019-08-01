import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { IItem } from './ItemType';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

interface ItemRowProps {
  item: IItem;
}

export const ItemRow = (props: ItemRowProps) => {
  const [item, setItem] = useState<IItem>(props.item);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('items', `items/${item.id}`, null)
      .then(response => setItem(response))
      .then(() => setLoading(false))
      .catch(error => alert(error));
  }, []);

  return (
    <div>
      {item ? (
        <div key={item.id}>
          <Link to={`/items/${item.id}`}>
            <Card key={item.id} className="item-card">
              <Card.Title className="item-card-title">{item.name}</Card.Title>
              <Card.Subtitle>
                <small>{item.slot_name}</small>
              </Card.Subtitle>
              <Card.Body>
                <div>{item.description}</div>
              </Card.Body>
            </Card>
          </Link>
        </div>
      ) : (
        <p>Item not found!</p>
      )}
    </div>
  );
};

export default ItemRow;
