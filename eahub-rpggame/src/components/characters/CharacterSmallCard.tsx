import * as React from 'react';

import { NavLink } from 'react-router-dom';
import { classIcon } from './charUtils';
import { ICharacter } from '../../types/CharacterTypes';
import { Segment, Grid } from 'semantic-ui-react';

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
      <Grid>
        <Grid.Row columns={12} divided={true}>
          <Grid.Column width={6}>
            <img
              className="ui mini image"
              src={`${classIcon(character.player_class_name)}`}
              alt={character.player_class_name}
            />
          </Grid.Column>
          <Grid.Column width={5}>
            <div className="middle aligned content">
              <div className="header">{character.name}</div>
              <div className="extra">
                <span>{character.player_class_name}</span>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </NavLink>
  );
};

export default CharacterSmallCard;
