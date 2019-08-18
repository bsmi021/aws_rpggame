import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { connect } from 'react-redux';
import { getItems } from '../../actions/ItemActions';
import { IItem } from '../../types/ItemTypes';
import ItemList from './ItemList';
import { IApplicationState } from '../../store/Store';

interface IProps extends RouteComponentProps {
  getItems: typeof getItems; // action creator
  loading: boolean; // indicates loading
  items: IItem[]; // typed array
}

class ItemsPage extends React.Component<IProps> {
  public componentDidMount() {
    if (this.props.items.length === 0 && !this.props.loading) {
      this.props.getItems();
    }
  }

  public render() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const search = searchParams.get('search') || '';

    return (
      <div className="ui container-fluid">
        <h4>Items</h4>
        <ItemList
          search={search}
          items={this.props.items}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

const mapStateToProps = (store: IApplicationState) => {
  return {
    loading: store.items.itemsLoading,
    items: store.items.items
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getItems: () => dispatch(getItems())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemsPage);
