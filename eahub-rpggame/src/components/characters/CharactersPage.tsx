import * as React from 'react';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import 'url-search-params-polyfill';
import { connect } from 'react-redux';

import CharacterList from './CharacterList';
import { getCharacters } from '../../actions/CharacterActions';
import { ICharacter } from '../../types/CharacterTypes';
import { IApplicationState } from '../../store/Store';
import { Segment, Button, Icon } from 'semantic-ui-react';
import { firstBy } from 'thenby';

interface IProps extends RouteComponentProps {
  getCharacters: typeof getCharacters; // action creator
  loading: boolean; // indicates the loading status
  characters: ICharacter[]; // typed array
  isAuthenticated: boolean;
  userId: string;
}

class CharactersPage extends React.Component<IProps> {
  public componentDidMount() {
    if (!this.props.loading) {
      this.props.getCharacters();
    }
  }

  public render() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const search = searchParams.get('search') || '';

    return (
      <div className="ui container" style={{ margin: '1px', padding: 0 }}>
        <Segment>
          <NavLink
            to="/characters/new"
            className="ui button primary float-right"
          >
            Create New
          </NavLink>
          <Button
            icon={true}
            onClick={() => this.props.getCharacters()}
            color="blue"
            style={{ margin: '1px' }}
          >
            <Icon name="refresh" />
          </Button>
        </Segment>
        <Segment>
          <CharacterList
            search={search}
            characters={this.props.characters.sort(
              firstBy(c => c.name, { direction: -1 })
            )}
            loading={this.props.loading}
          />
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (store: IApplicationState) => {
  return {
    loading: store.characters.charactersLoading,
    characters: store.characters.characters,
    userId: store.auth.userId ? store.auth.userId : '',
    isAuthenticated: store.auth.isAuthenticated
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    getCharacters: () => dispatch(getCharacters())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharactersPage);
