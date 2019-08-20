import * as React from 'react';

import { NavLink } from 'react-router-dom';
import { classIcon } from './charUtils';
import { ICharacter } from '../../types/CharacterTypes';

interface IProps {
  character?: ICharacter;
}

export const CharacterSmallCard: React.FunctionComponent<IProps> = props => {
  const character = props.character;
  if (!character) {
    return null;
  }

  return (
    <NavLink
      to={`/characters/${character.id}`}
      className="item"
      style={{ background: 'darkgrey' }}
    >
      <div className="ui items">
        <div className="item">
          <div className="ui avatar image">
            <img
              src={`${classIcon(character.player_class_name)}`}
              style={{ background: 'lightgrey', height: '25px', width: '25px' }}
              alt={character.player_class_name}
            />
          </div>
          <div className="middle aligned content">
            <div className="header">{character.name}</div>
            <div className="extra">
              <span>{character.player_class_name}</span>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default CharacterSmallCard;
