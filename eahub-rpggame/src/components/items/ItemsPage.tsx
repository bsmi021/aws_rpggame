import * as React from 'react';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import 'url-search-params-polyfill';
import { connect } from 'react-redux';
import { getItems } from '../../actions/ItemActions';
import { IItem } from '../../types/ItemTypes';
import ItemList from './ItemList';
import { IApplicationState } from '../../store/Store';
import { Segment, Form, DropdownProps } from 'semantic-ui-react';
import { itemQualities, itemSlots } from './itemUtils';
import { firstBy } from 'thenby';

interface IProps extends RouteComponentProps {
  getItems: typeof getItems; // action creator
  loading: boolean; // indicates loading
  items: IItem[]; // typed array
}

interface IState {
  level?: number | undefined;
  slot?: number | undefined;
  quality?: number | undefined;
}

class ItemsPage extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = {
      level: undefined,
      slot: undefined,
      quality: undefined
    };

    this.onQualityChange = this.onQualityChange.bind(this);
  }

  public componentDidMount() {
    if (this.props.items.length === 0 && !this.props.loading) {
      this.props.getItems(
        this.state.slot,
        this.state.quality,
        this.state.level
      );
    }
  }

  public render() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const search = searchParams.get('search') || '';

    return (
      <div className="ui container-fluid">
        <Segment.Inline>
          <h2>Items</h2>
          <Segment>
            <Segment.Inline>
              <NavLink
                to="/items/new"
                className="ui button primary float-right"
              >
                Create New
              </NavLink>

              <form className="ui form">
                <Form.Group>
                  <Form.Select
                    options={itemQualities}
                    onChange={this.onQualityChange}
                    value={this.state.quality}
                    placeholder="Select a quality"
                  />
                  <Form.Select
                    options={itemSlots}
                    onChange={this.onSlotChange}
                    value={this.state.slot}
                    placeholder="Select a slot"
                  />
                </Form.Group>
              </form>
              <button
                className="ui small button blue float-right"
                onClick={e =>
                  this.props.getItems(
                    this.state.slot === -99 ? undefined : this.state.slot,
                    this.state.quality !== -99 ? this.state.quality : undefined,
                    this.state.level
                  )
                }
              >
                <i className="search icon" />
              </button>
            </Segment.Inline>
          </Segment>
        </Segment.Inline>
        <Segment>
          <ItemList
            search={search}
            items={this.props.items.sort(
              firstBy(s => s.slot, { direction: 1 }).thenBy(s => s.name)
            )}
            loading={this.props.loading}
          />
        </Segment>
      </div>
    );
  }

  private onQualityChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    drop: DropdownProps
  ) => {
    event.preventDefault();

    if (drop.value) {
      const qualityId = parseInt(drop.value.toString(), 0);

      this.setState(() => ({ quality: qualityId }));
    }
  };

  private onSlotChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    drop: DropdownProps
  ) => {
    event.preventDefault();

    if (drop.value) {
      const slotId = parseInt(drop.value.toString(), 0);
      if (slotId === -99) {
        this.setState({ slot: undefined });
      }
      this.setState({ slot: slotId });
    }
  };
}

const mapStateToProps = (store: IApplicationState) => {
  return {
    loading: store.items.itemsLoading,
    items: store.items.items
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getItems: (slot?: number, quality?: number, level?: number) =>
      dispatch(getItems(slot, quality, level))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemsPage);
