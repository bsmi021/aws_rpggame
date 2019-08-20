import * as React from 'react';
import { ICharacter, CharacterActionTypes } from '../../types/CharacterTypes';

import { NavLink } from 'react-router-dom';
import { classIcon, isMyCharacter } from './charUtils';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../store/Store';

interface IProps {
  character?: ICharacter;
}

export const CharacterCard: React.FunctionComponent<IProps> = props => {
  const character = props.character;
  const dispatch = useDispatch();
  const userId =
    useSelector((state: IApplicationState) => {
      return state.auth.userId;
    }) || '';

  const defaultCharacterId = useSelector((state: IApplicationState) => {
    return state.characters.defaultCharacter
      ? state.characters.defaultCharacter.id
      : '';
  });

  if (!character) {
    return null;
  }

  const isDefaultChar = () => {
    return defaultCharacterId === character.id;
  };

  return (
    character && (
      <NavLink to={`/characters/${character.id}`} className={'ui card raised'}>
        <div className="ui tiny image">
          <img
            src={`${classIcon(character.player_class_name)}`}
            alt={character.player_class_name}
          />
        </div>
        <div className="middle aligned content">
          <div className="header">{character.name}</div>
          <div className="meta">{character.player_class_name}</div>
          {isMyCharacter(character.account, userId) && (
            <div className="extra content float">
              <button
                className="ui mini button"
                onClick={e => {
                  e.preventDefault();
                  dispatch({
                    type: CharacterActionTypes.SETDEFAULT,
                    character
                  });
                }}
              >
                <i className={`user icon ${isDefaultChar() ? 'blue' : ''}`} />
                {!isDefaultChar() ? 'Make Default' : 'Default'}
              </button>
            </div>
          )}
        </div>
      </NavLink>
    )
  );
};

export default CharacterCard;
