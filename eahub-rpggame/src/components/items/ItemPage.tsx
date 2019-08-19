import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { getItem } from '../../actions/ItemActions';
import { IItem } from '../../types/ItemTypes';
import { IApplicationState } from '../../store/Store';
import Item from './Item';

interface IProps extends RouteComponentProps<{ id: string }> {
  getItem: typeof getItem;
  loading: boolean;
  item?: IItem;
}

class ItemPage extends React.Component<IProps> {
  public async componentDidMount() {
    this.props.getItem(this.props.match.params.id);
  }

  public render() {
    const item = this.props.item;

    return (
      <div className="ui container">
        {item ? (
          <Item item={item} loading={this.props.loading} />
        ) : (
          <p>Item not found</p>
        )}
      </div>
    );
  }
}

const mapStateToProps = (store: IApplicationState) => {
  return {
    loading: store.items.itemsLoading,
    item: store.items.currentItem || undefined
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getItem: (id: string) => dispatch(getItem(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemPage);
