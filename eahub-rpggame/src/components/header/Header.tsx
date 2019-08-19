import * as React from 'react';
import { Menu, MenuItemProps } from 'semantic-ui-react';
import { NavLink, Redirect } from 'react-router-dom';
import { connect, useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import { button } from '@aws-amplify/ui';
import { signOut } from '../../actions/AuthActions';
import CharacterSmallCard from '../characters/CharacterSmallCard';

const Header: React.FunctionComponent = () => {
  const isAuthenticated = useSelector(
    (state: IApplicationState) => state.auth.isAuthenticated
  );
  const defaultCharacter = useSelector(
    (state: IApplicationState) => state.characters.defaultCharacter
  );

  const dispatch = useDispatch();

  return (
    <div className="ui pointing stackable inverted menu">
      <NavLink className="item" to="/" activeClassName="item">
        <h3>SASCraft Demo</h3>
      </NavLink>
      <NavLink to="/characters" className="item" activeClassName="item active">
        Characters
      </NavLink>
      <NavLink to="/items" className="item" activeClassName="item active">
        Items
      </NavLink>
      <div className="right menu">
        {defaultCharacter && (
          <CharacterSmallCard character={defaultCharacter} />
        )}
        {isAuthenticated && (
          <div className="item">
            <button className="ui button" onClick={() => dispatch(signOut())}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
