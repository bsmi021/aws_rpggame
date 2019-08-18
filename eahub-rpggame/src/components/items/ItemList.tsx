import * as React from 'react';
import { Link } from 'react-router-dom';
import { IItem } from '../../types/ItemTypes';
import withLoader from '../common/withLoader';
import { Card } from 'semantic-ui-react';
import ItemCard from './ItemCard';

interface IProps {
  items?: IItem[];
  search: string;
  loading: boolean;
}

const ItemList: React.FunctionComponent<IProps> = props => {
  const search = props.search;
  const items = props.items;

  const renderList = () => {
    return (
      <React.Fragment>
        {props.items &&
          props.items.map((item: IItem) => {
            return <ItemCard key={item.id} item={item} />;
          })}
      </React.Fragment>
    );
  };

  return (
    <div className="container-category">
      <Card.Group stackable={true} textAlign="left">
        {renderList()}
      </Card.Group>
    </div>
  );
};

export default withLoader(ItemList);
