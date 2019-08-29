import * as React from 'react';

import { NavLink, Redirect } from 'react-router-dom';
import { classIcon } from './charUtils';
import { ICharacter } from '../../types/CharacterTypes';
import { Segment, Grid, Header, Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import { startFight } from '../../actions/FightActions';

interface IProps {
  character?: ICharacter;
}

export const CharacterSmallCard: React.FunctionComponent<IProps> = props => {
  const character = props.character;
  const dispatch = useDispatch();

  const onStartFight = (e: any) => {
    e.preventDefault();

    dispatch(startFight());
  };

  if (!character) {
    return null;
  }

  return (
    <NavLink to={`/characters/${character.id}`} className="item">
      <div
        style={{
          height: '50px',
          width: '200px',
          alignContent: 'middle',
          boxShadow: '0px 0px 8px -1px #dae1e7 ',
          background: '#183661',
          margin: '2px'
        }}
      >
        <img
          className="ui mini image"
          src={`${classIcon(character.player_class_name)}`}
          alt={character.player_class_name}
          style={{
            float: 'left',
            margin: '10px'
          }}
        />

        <Header as="h2" style={{ margin: 0, color: '#dae1e7' }}>
          {character.name}
        </Header>
        <div className="extra">
          <span>{character.player_class_name}</span>
        </div>
      </div>
    </NavLink>
  );
};

export default CharacterSmallCard;
