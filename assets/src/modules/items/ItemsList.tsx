import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { IItem } from './ItemType';
import 'url-search-params-polyfill';
import { ItemRow } from './ItemRow';

interface ItemsListProps {
  items: IItem[];
}

interface ItemsState {
  items: IItem[];
}

export const ItemsList = (props: ItemsListProps) => {
  const [items, setItems] = useState<IItem[]>(props.items);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('items', '/items', null)
      .then(response => setItems(response.items))
      .then(() => setLoading(false))
      .catch(error => alert(error));
  }, []);

  return !loading ? (
    <div className="well-bs no-padding-top col-md-12 no-border">
      <div className="container-category">
        <h3>Inventory Items</h3>
      </div>
      {items.map(item => {
        return (
          <div key={item.id}>
            <ItemRow item={item} />
          </div>
        );
      })}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default ItemsList;
