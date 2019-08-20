import * as React from 'react';
import { Form, DropdownProps } from 'semantic-ui-react';
import { classDescription } from './charUtils';
import { useDispatch } from 'react-redux';
import { createCharacter } from '../../actions/CharacterActions';
import { Redirect } from 'react-router';
import { Dispatch } from 'redux';

const classOptions = [
  { key: 1, text: 'WARRIOR', value: 1 },
  { key: 2, text: 'ARCHER', value: 2 },
  { key: 3, text: 'SORCERER', value: 3 },
  { key: 4, text: 'ROGUE', value: 4 }
];

const CharacterForm: React.FunctionComponent = () => {
  const [characterName, setCharacterName] = React.useState('');
  const [playerClass, setPlayerClass] = React.useState(1);
  const [charNameValid, setCharNameValid] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const dispatch: Dispatch<any> = useDispatch();

  const onPlayerNameChange = (e: any, d: any) => {
    const charName: string = d.value;
    setCharacterName(charName);

    /// Character must have a 3 letter name or greater
    setCharNameValid(charName.length >= 3);
  };

  const onPlayerClassChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    drop: DropdownProps
  ) => {
    event.preventDefault();

    if (drop.value) {
      const classId = parseInt(drop.value.toString(), 0);
      setPlayerClass(classId);
    }
  };

  if (redirect) {
    return <Redirect to="/characters" />;
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();

        dispatch(createCharacter(characterName, playerClass));

        setRedirect(true);
      }}
      className="ui form error"
    >
      <Form.Group>
        <Form.Input
          label="Name"
          placeholder="Character Name"
          type="username"
          value={characterName}
          onChange={onPlayerNameChange}
        />
        <Form.Select
          label="Class"
          options={classOptions}
          placeholder="Player Class"
          onChange={onPlayerClassChange}
          value={playerClass}
        />
      </Form.Group>
      <div className="text">{classDescription(playerClass)}</div>
      <button className="ui button primary" disabled={!charNameValid}>
        Save
      </button>
    </form>
  );
};

export default CharacterForm;
