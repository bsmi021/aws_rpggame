import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { ICharacter } from './CharacterType';
import 'url-search-params-polyfill';
import CharacterRow from './CharacterRow';

interface CharacterListProps {
  characters: ICharacter[];
}

interface State {
  characters: ICharacter[];
}

export const CharacterList = (props: CharacterListProps) => {
  const [characters, setCharacters] = useState<ICharacter[]>(props.characters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('characters', '/characters', null)
      .then(response => setCharacters(response.characters))
      .then(() => setLoading(false))
      .catch(error => alert(error));
  }, []);

  return !loading ? (
    <div className="well-bs no-padding-top col-md-12 no-border">
      <div className="container-category">
        <h3>Player Characters</h3>
      </div>
      <ul className="items-list">
        {characters.map(character => {
          return (
            <div key={character.id}>
              <CharacterRow character={character} />
            </div>
          );
        })}
      </ul>
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

export default CharacterList;
