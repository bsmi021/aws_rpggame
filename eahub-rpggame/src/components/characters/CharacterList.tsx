import * as React from 'react';
import { ICharacter } from '../../types/CharacterTypes';
import withLoader from '../common/withLoader';

import { useSelector } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import CharacterCard from './CharacterCard';
import { Checkbox } from 'semantic-ui-react';
import { firstBy } from 'thenby';
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

  const [filterCharacters, setFilterCharacters] = React.useState(true);

  return (
    <div className="ui container centered">
      <Checkbox
        checked={filterCharacters}
        onChange={e => setFilterCharacters(!filterCharacters)}
        label="Show only my characters"
      />
      <div className="ui cards">
        {characters &&
          characters
            .sort(
              firstBy(c => c.account === userId, { direction: -1 }).thenBy(
                c => c.name
              )
            )
            .filter((a: ICharacter) =>
              filterCharacters ? a.account === userId : true
            )
            .map((character: ICharacter) => {
              return <CharacterCard key={character.id} character={character} />;
            })}
      </div>
    </div>
  );
};

export default withLoader(CharactersList);
