import React, { useState, useEffect } from "react";
import { IItem } from "./ItemType";
import "url-search-params-polyfill";
import { ItemRow } from "./ItemRow";

import { connect, useSelector, useDispatch } from "react-redux";
import { fetchItems } from "../../actions/ItemActions";

export const ItemsList = () => {
  const [loading, setLoading] = useState(true);
  const items: IItem[] = useSelector((state: any) =>
    Object.values(state.items)
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchItems());

    setLoading(false);
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
    <div className="ui segment">
      <p />
      <div className="ui active dimmer">
        <div className="ui loader" />
      </div>
    </div>
  );
};

export default connect(
  null,
  { fetchItems }
)(ItemsList);
