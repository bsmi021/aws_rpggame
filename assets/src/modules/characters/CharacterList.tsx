import React, { useState, useEffect } from "react";
import { ICharacter } from "./CharacterType";
import "url-search-params-polyfill";
import CharacterRow from "./CharacterRow";

import { connect, useSelector, useDispatch } from "react-redux";
import { fetchCharacters } from "../../actions/CharacterActions";

export const CharacterList = () => {
  const [loading, setLoading] = useState(true);

  const characters: ICharacter[] = useSelector((state: any) =>
    Object.values(state.characters)
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCharacters());

    setLoading(false);
  }, []);

  return !loading ? (
    <div className="well-bs no-padding-top col-md-12 no-border">
      <div className="container-category">
        <h3>Player Characters</h3>
      </div>
      <ul className="items-list">
        {characters.map((character: ICharacter) => {
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

const mapStateToProps = (state: any) => {
  return {
    characters: Object.values(state.characters)
  };
};

export default connect(
  null,
  { fetchCharacters }
)(CharacterList);
