import * as React from 'react';
import { Progress } from 'semantic-ui-react';
import { ICharacter } from '../../types/CharacterTypes';

export interface IProps {
  character: ICharacter;
}

const CharacterXPBar: React.SFC<IProps> = props => {
  return (
    <div style={{ color: 'white', margin: '2px' }}>
      <Progress
        total={props.character.xp_to_lvl}
        value={props.character.curr_lvl_xp}
        color="purple"
        active={true}
      />
    </div>
  );
};

export default CharacterXPBar;
