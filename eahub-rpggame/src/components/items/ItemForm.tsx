import React, { FunctionComponent, useState } from 'react';
import {
  Form,
  DropdownProps,
  FormGroup,
  Segment,
  Checkbox
} from 'semantic-ui-react';
import { Redirect } from 'react-router';
import {
  itemSlots,
  itemQualities,
  calcAttackPower,
  calcStamina,
  calcCritChance
} from './itemUtils';
import { useDispatch } from 'react-redux';
import { createItem } from '../../actions/ItemActions';

const ItemForm: React.FunctionComponent = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quality, setQuality] = useState(1);
  const [slot, setSlot] = useState(0);
  const [damage, setDamage] = useState(0);
  const [level, setLevel] = useState(0);
  const [critChance, setCritChance] = useState(0);
  const [redirect, setRedirect] = useState(false);
  const [stamina, setStamina] = useState(0);
  const [isWarrior, setIsWarrior] = useState(false);
  const [isSorcerer, setIsSorcerer] = useState(false);
  const [isArcher, setIsArcher] = useState(false);
  const [isRogue, setIsRogue] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = (e: any) => {
    e.preventDefault();

    dispatch(
      createItem({
        name,
        description,
        quality,
        slot,
        damage,
        level,
        crit_chance: critChance,
        stamina,
        is_warrior: isWarrior,
        is_rogue: isRogue,
        is_archer: isArcher,
        is_sorcerer: isSorcerer
      })
    );
    setRedirect(true);
  };

  const calcItemStats = (ilevel: number, iquality: number) => {
    setDamage(calcAttackPower(ilevel, iquality));
    setStamina(calcStamina(ilevel, iquality));
    setCritChance(Number(calcCritChance(ilevel, iquality)));
  };

  const onTextChange = (e: any, d: any) => {
    switch (d.name) {
      case 'name':
        setName(d.value);
        break;
      case 'description':
        setDescription(d.value);
        break;
      default:
        break;
    }
  };

  const onIsWarriorChanged = (e: any, d: any) => {
    setIsWarrior(d.value);
  };
  const onIsSorcererChanged = (e: any, d: any) => {
    setIsSorcerer(d.value);
  };
  const onIsArcherChanged = (e: any, d: any) => {
    setIsArcher(d.value);
  };
  const onIsRogueChanged = (e: any, d: any) => {
    setIsRogue(d.value);
  };

  const onLevelChange = (e: any, d: any) => {
    const re: RegExp = /^[0-9]+$/;

    if (d.value === '' || re.test(d.value)) {
      const dLevel = Number(d.value);

      setLevel(dLevel);

      calcItemStats(dLevel, quality);
    }
  };

  const onQualityChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    drop: DropdownProps
  ) => {
    // event.preventDefault();

    if (drop.value) {
      const qualityId = parseInt(drop.value.toString(), 0);
      setQuality(qualityId);

      if (level) {
        calcItemStats(level, qualityId);
      }
    }
  };

  const onSlotChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    drop: DropdownProps
  ) => {
    event.preventDefault();

    if (drop.value) {
      const slotId = parseInt(drop.value.toString(), 0);
      setSlot(slotId);
    }
  };

  if (redirect) {
    return <Redirect to="/items" />;
  }

  return (
    <Segment>
      <form className="ui form error" onSubmit={onSubmit}>
        <Form.Group>
          <Form.Input
            label="Name"
            name="name"
            placeholder="Item Name"
            onChange={onTextChange}
            value={name}
          />
          <Form.Input
            label="Description"
            placeholder="Item Description"
            value={description}
            onChange={onTextChange}
            name="description"
          />
        </Form.Group>
        <Form.Group inline={true}>
          <label>Class(es):</label>
          <Checkbox
            label="Warrior"
            checked={isWarrior}
            onChange={onIsWarriorChanged}
            name="isWarrior"
          />
          <Checkbox
            label="Sorcerer"
            checked={isSorcerer}
            onChange={onIsSorcererChanged}
            name="isSorcerer"
          />
          <Checkbox
            label="Archer"
            checked={isArcher}
            onChange={onIsArcherChanged}
            name="isArcher"
          />
          <Checkbox
            label="Rogue"
            checked={isRogue}
            onChange={onIsRogueChanged}
            name="isRogue"
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            label="Min. Level"
            placeholder="Minimum level"
            value={level}
            onChange={onLevelChange}
            name="level"
            autoComplete="off"
          />
          <Form.Select
            label="Item Slot"
            placeholder="Select Item Slot"
            options={itemSlots}
            value={slot}
            onChange={onSlotChange}
          />
          <Form.Select
            label="Item Quality"
            placeholder="Select Item Quality"
            options={itemQualities}
            value={quality}
            onChange={onQualityChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            label="Stamina"
            placeholder="Stamina"
            value={stamina}
            name="stamina"
            readOnly={true}
          />
          <Form.Input
            label="Crit Chance"
            placeholder="Enter Crit Chance %"
            name="critChance"
            value={critChance}
            readOnly={true}
          />
          <Form.Input
            label="Damage"
            placeholder="Enter damage"
            value={damage}
            name="damage"
            readOnly={true}
          />
        </Form.Group>
        <Segment>
          <button className="ui button primary">Save</button>
        </Segment>
      </form>
    </Segment>
  );
};

export default ItemForm;
