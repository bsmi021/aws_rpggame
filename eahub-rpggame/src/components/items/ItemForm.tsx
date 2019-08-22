import React, { FunctionComponent, useState } from 'react';
import { Form, DropdownProps, FormGroup, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import { itemSlots, itemQualities } from './itemUtils';
import { useDispatch } from 'react-redux';
import { createItem } from '../../actions/ItemActions';

const ItemForm: React.FunctionComponent = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quality, setQuality] = useState(1);
  const [slot, setSlot] = useState(0);
  const [damage, setDamage] = useState();
  const [level, setLevel] = useState(1);
  const [critChance, setCritChance] = useState();
  const [redirect, setRedirect] = useState(false);
  const [stamina, setStamina] = useState();

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
        stamina
      })
    );
    setRedirect(true);
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

  const handleNumberChange = (e: any, d: any) => {
    const re: RegExp = /^[0-9.,]+$/;
    if (d.value === '' || re.test(d.value)) {
      switch (d.name) {
        case 'critChance':
          setCritChance(Number(d.value));
          break;
        case 'stamina':
          setStamina(Number(d.value));
          break;
        case 'damage':
          setDamage(Number(d.value));
          break;
        case 'level':
          setLevel(Number(d.value));
          break;
        default:
          break;
      }
    }
  };

  const onQualityChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    drop: DropdownProps
  ) => {
    event.preventDefault();

    if (drop.value) {
      const qualityId = parseInt(drop.value.toString(), 0);
      setQuality(qualityId);
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
        <Form.Group>
          <Form.Input
            label="Min. Level"
            placeholder="Minimum level"
            value={level}
            onChange={handleNumberChange}
            name="level"
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
            placeHolder="Enter Stamina"
            value={stamina}
            onChange={handleNumberChange}
            name="stamina"
          />
          <Form.Input
            label="Crit Chance"
            placeholder="Enter Crit Chance %"
            name="critChance"
            value={critChance}
            onChange={handleNumberChange}
          />
          <Form.Input
            label="Damage"
            placeholder="Enter damage"
            value={damage}
            onChange={handleNumberChange}
            name="damage"
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
