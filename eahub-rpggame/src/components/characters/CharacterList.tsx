import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ICharacter } from '../../types/CharacterTypes';
import { charactersReducer } from '../../reducers/CharactersReducer';
import withLoader from '../common/withLoader';

import { useSelector, connect } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import CharacterCard from './CharacterCard';

interface IProps {
  characters?: ICharacter[];
  search: string;
  loading: boolean;
}

const isMyCharacter = (account: string, userId: string) => {
  return account === userId;
};

const CharactersList: React.FunctionComponent<IProps> = props => {
  const search = props.search;
  const characters = props.characters;

  return (
    <div className="ui container centered">
      <div className="ui cards">
        {characters &&
          characters.map((character: ICharacter) => {
            return <CharacterCard key={character.id} character={character} />;
          })}
      </div>
    </div>
  );
};

export default withLoader(CharactersList);
