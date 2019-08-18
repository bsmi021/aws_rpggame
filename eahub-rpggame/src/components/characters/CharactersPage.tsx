import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import { connect } from 'react-redux';

import CharacterList from './CharacterList';
import { getCharacters } from '../../actions/CharacterActions';
import { ICharacter } from '../../types/CharacterTypes';
import { IApplicationState } from '../../store/Store';

interface IProps extends RouteComponentProps {
  getCharacters: typeof getCharacters; // action creator
  loading: boolean; // indicates the loading status
  characters: ICharacter[]; // typed array
  isAuthenticated: boolean;
  userId: string;
}

class CharactersPage extends React.Component<IProps> {
  public componentDidMount() {
    if (this.props.characters.length === 0 && !this.props.loading) {
      this.props.getCharacters();
    }
  }

  public render() {
    const searchParams = new URLSearchParams(this.props.location.search);
    const search = searchParams.get('search') || '';

    return (
      <div className="ui container-fluid">
        <div className="ui container">
          <h4>Characters</h4>
          {this.props.isAuthenticated && (
            <button className="float-right">Create New</button>
          )}
        </div>
        <CharacterList
          search={search}
          characters={this.props.characters}
          loading={this.props.loading}
          userId={this.props.userId}
        />
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
