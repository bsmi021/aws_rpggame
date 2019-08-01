import React from 'react';
import { API } from 'aws-amplify';
import { ICharacter } from './CharacterType';
import { RouteComponentProps } from 'react-router-dom';
import 'url-search-params-polyfill';
import CharacterRow from './CharacterRow';

interface Props {}

interface State {
  characters: ICharacter[];
}

export class CharacterList extends React.Component<RouteComponentProps, State> {
  public static getDerivedStateFromProps(
    props: RouteComponentProps,
    state: State
  ) {
    return {
      characters: state.characters
    };
  }

  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      characters: []
    };
  }

  componentDidMount() {
    API.get('characters', '/characters', null)
      .then(response => {
        this.setState({ characters: response.characters });
      })
      .catch(error => alert(error));
  }

  render() {
    return (
      <div className="well-bs no-padding-top col-md-12 no-border">
        <div className="container-category">
          <h3>Player Characters</h3>
        </div>
        <ul className="items-list">
          {this.state.characters.map(character => {
            return (
              <div key={character.id}>
                <CharacterRow character={character} />
              </div>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default CharacterList;
