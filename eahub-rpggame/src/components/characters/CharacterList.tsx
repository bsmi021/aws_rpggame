import * as React from 'react';
import { ICharacter } from '../../types/CharacterTypes';
import withLoader from '../common/withLoader';

import { useSelector } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import CharacterCard from './CharacterCard';

interface IProps {
  characters?: ICharacter[];
  search: string;
  loading: boolean;
}

const CharactersList: React.FunctionComponent<IProps> = props => {
  // const search = props.search;
  const characters = props.characters;
  const userId = useSelector(
    (state: IApplicationState) => state.auth.userId || ''
  );

  return (
    <div className="ui container centered">
      <div className="ui cards">
        {characters &&
          characters
            .sort((a: ICharacter, b: ICharacter) =>
              a.account === userId ? -1 : 1
            )
            .map((character: ICharacter) => {
              return <CharacterCard key={character.id} character={character} />;
            })}
      </div>
    </div>
  );
};

export default withLoader(CharactersList);
