import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { ICharacter } from "./CharacterType";
import { Link } from "react-router-dom";

import { connect, useSelector, useDispatch } from "react-redux";
import { fetchCharacter } from "../../actions/CharacterActions";

interface CharacterRowProps {
  character: ICharacter;
}

const CharacterRow = (props: CharacterRowProps) => {
  const [character, setCharacter] = useState<ICharacter>(props.character);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  useEffect(() => {
    if (!character.name) {
      dispatch(fetchCharacter(character.id))
      
      // API.get('characters', `characters/${character.id}`, null)
      //   .then(response => {
      //     setCharacter(response);
      //   })
      //   .then(() => setLoading(false))
      //   .catch(error => alert(error));
    }
  }, []);

  return (
    <div key={character.id} className="card">
      <Link to={`/characters/${character.id}`}>
        <div className="content">
          <div className="header">{character.name}</div>
          <div
            className="meta"
            style={{
              color: "grey",
              fontSize: "12px",
              fontStyle: "italic",
              marginLeft: "20px"
            }}
          >
            <span>
              Level {character.level} {character.player_class_name}
            </span>
          </div>
        </div>

        <div className="extra content">10 Fights</div>
      </Link>
    </div>
  );
};

export default CharacterRow;
