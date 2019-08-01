import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import { ICharacter } from './CharacterType';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

interface CharacterRowProps {
  character: ICharacter;
}

const CharacterRow = (props: CharacterRowProps) => {
  const [character, setCharacter] = useState<ICharacter>(props.character);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!character.name) {
      API.get('characters', `characters/${character.id}`, null)
        .then(response => {
          setCharacter(response);
        })
        .then(() => setLoading(false))
        .catch(error => alert(error));
    }
  }, []);

  return (
    <div>
      <div key={character.id}>
        <Link to={`/characters/${character.id}`}>
          <Card className="card">
            <Card.Title>{character.name}</Card.Title>
            <Card.Subtitle>
              <div
                className="metadata"
                style={{
                  color: 'grey',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  marginLeft: '20px'
                }}
              >
                Level {character.level} {character.player_class_name}
              </div>
            </Card.Subtitle>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default CharacterRow;
