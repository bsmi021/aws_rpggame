import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IApplicationState } from '../../store/Store';
import { signOut } from '../../actions/AuthActions';
import CharacterSmallCard from '../characters/CharacterSmallCard';
import { Button } from 'semantic-ui-react';

const Header: React.FunctionComponent = () => {
  const isAuthenticated = useSelector(
    (state: IApplicationState) => state.auth.isAuthenticated
  );
  const defaultCharacter = useSelector(
    (state: IApplicationState) => state.characters.defaultCharacter
  );

  const dispatch = useDispatch();

  return (
    <div className="ui pointing inverted stackable menu">
      <NavLink className="item" to="/" activeClassName="item">
        <img
          src="/sas-logo-white.png"
          alt="SAS logo"
          style={{ width: '100px' }}
        />
        <h3 style={{ marginLeft: '10px', verticalAlign: 'middle' }}>
          SASCraft Demo
        </h3>
      </NavLink>
      <NavLink
        to="/characters"
        className="item dropdown"
        activeClassName="item active"
      >
        Characters
      </NavLink>
      <NavLink
        to="/fight"
        className="item"
        activeClassName="item active"
        hidden={!defaultCharacter}
      >
        Fight
      </NavLink>
      <div className="right menu" style={{ padding: 0 }}>
        {defaultCharacter && (
          <CharacterSmallCard character={defaultCharacter} />
        )}
        {isAuthenticated && (
          <div className="item">
            <Button size="mini" onClick={() => dispatch(signOut())}>
              Log Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
