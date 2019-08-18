import * as React from 'react';
import { Link } from 'react-router-dom';
import { ICharacter } from '../../types/CharacterTypes';
import { charactersReducer } from '../../reducers/CharactersReducer';
import withLoader from '../common/withLoader';

import { useSelector, connect } from 'react-redux';
import { IApplicationState } from '../../store/Store';

interface IProps {
  characters?: ICharacter[];
  search: string;
  loading: boolean;
  userId?: string;
}

const isMyCharacter = (account: string, userId: string) => {
  return account === userId;
};

const CharactersList: React.FunctionComponent<IProps> = props => {
  const search = props.search;
  const characters = props.characters;

  console.log(props);
  return (
    <div className="list">
      <ul className="items list">
        {characters &&
          characters.map((character: ICharacter) => {
            return (
              <div key={character.id}>
                {character.name}
                {props.userId &&
                  props.userId.toLowerCase().trim() ===
                    character.account.toLowerCase().trim() && (
                    <div>Your character</div>
                  )}
              </div>
            );
          })}
      </ul>
    </div>
  );
};

export default withLoader(CharactersList);
