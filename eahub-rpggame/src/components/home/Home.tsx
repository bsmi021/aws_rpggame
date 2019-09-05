import * as React from 'react';
import { Container, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const Home: React.FunctionComponent = () => {
  return (
    <Container style={{ background: '#dae1e7' }}>
      <h3>Welcome to the SASCraft demonstration</h3>
      <p>
        The SAScraft Demo is an online roleplaying game which allows players to
        create characters of different classes, and then fight enemies to
        getting stronger and earn upgraded gear. The intention of this online
        game is to demonstrate AWS Serverless computing with SAS platform
        integration.
      </p>
      <br />
      <Segment>
        <ol>
          <li>
            Start by creating a character and choosing a class, the character's
            class will provide the starting statistics and attack speed.{' '}
            <NavLink
              to="/characters/new"
              className="ui primary button"
              style={{ margin: '5px' }}
            >
              Create Character
            </NavLink>
          </li>
          <br />
          <li>
            Once your character is created make it your <i>default</i>{' '}
            character, this will make it so you can update its inventory and
            enter <b>fights</b>
          </li>
          <br />
          <li>
            Enter a fight using the navigation menu, use the{' '}
            <button className="ui primary button">Attack</button> button to
            attack your randomly selected enemy. You cannot spam attacks against
            the enemy, your character requires time to cooldown. Be on the look
            out your enemy will attack you back.
          </li>
          <br />
          <li>
            At the conclusion of the fight, if you were successful your
            character will receive experience points and possibly loot, which
            can potentially be upgraded gear to make your character stronger.
          </li>
          <br />
          <li>
            After claiming your loot, jump back to your character page and make
            sure to equip your new item.
          </li>
        </ol>
      </Segment>
    </Container>
  );
};

export default Home;
