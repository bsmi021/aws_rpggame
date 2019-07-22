# characters/models.py

import os
import json
from datetime import datetime
from uuid import uuid4
from py_linq import Enumerable

from pynamodb.attributes import (UnicodeAttribute,
                                 ListAttribute,
                                 BooleanAttribute,
                                 UTCDateTimeAttribute,
                                 NumberAttribute,
                                 JSONAttribute,
                                 MapAttribute)
from pynamodb.models import Model

aws_region = os.environ['REGION']

class BaseModel(Model):
    created_at = UTCDateTimeAttribute(default=datetime.utcnow())
    updated_at = UTCDateTimeAttribute(default=datetime.utcnow())


    def __iter__(self):
        for name, attr in self.get_attributes().items():
            if isinstance(attr, MapAttribute):
                if getattr(self, name):
                    yield name, getattr(self, name).as_dict()
            elif isinstance(attr, UTCDateTimeAttribute):
                if getattr(self, name):
                    yield name, attr.serialize(getattr(self, name))
            elif isinstance(attr, NumberAttribute):
                # if numeric return value as is.
                yield name, getattr(self, name)
            else:
                yield name, attr.serialize(getattr(self, name))

class InventoryItemMap(MapAttribute):
    id = UnicodeAttribute()
    slot = NumberAttribute()
    slot_name = UnicodeAttribute()
    damage = NumberAttribute()
    crit_chance = NumberAttribute()
    stamina = NumberAttribute(default=10)

class CharacterModel(BaseModel):
    class Meta:
        table_name = os.environ['DYNAMODB_TABLE']
        if 'ENV' in os.environ:
            host = 'http://localhost:8000'
        else:
            region = aws_region
            host = f'https://dynamodb.{aws_region}.amazonaws.com'

    id = UnicodeAttribute(hash_key=True, null=False, default=str(uuid4()))
    name = UnicodeAttribute()
    account = UnicodeAttribute(null=True)
    base_hp = NumberAttribute(default=100)
    level = NumberAttribute(default=1)
    xp_gained = NumberAttribute(default=0)
    base_min_damage = NumberAttribute(default=2)
    base_max_damage = NumberAttribute(default=8)
    base_crit_chance = NumberAttribute(default=.05)
    base_miss_chance = NumberAttribute(default=.05)
    base_critical_multiplier = NumberAttribute(default=2.5)
    min_damage = NumberAttribute(default=2)
    max_damage = NumberAttribute(default=8)
    crit_chance = NumberAttribute(default=.05)
    hit_points = NumberAttribute(default=100)
    current_hp = NumberAttribute(default=100)

    inventory = ListAttribute(of=InventoryItemMap)

    def calc_stats(self):
        base_min = self.base_min_damage
        base_max = self.base_max_damage
        base_crit = self.base_crit_chance
        base_hp = self.base_hp

        if self.inventory is not None:
            base_crit += Enumerable(self.inventory) \
                .sum(lambda x: x.crit_chance)
            base_min += Enumerable(self.inventory) \
                .sum(lambda x: round(x.damage / 4.75))
            base_max += Enumerable(self.inventory) \
                .sum(lambda x: round(x.damage / 2))
            base_hp += Enumerable(self.inventory) \
                .sum(lambda x: x.stamina * 10)
        else:
            self.inventory = []

        base_crit = int(base_crit * 100) * .01

        self.crit_chance = base_crit
        self.max_damage = base_max
        self.min_damage = base_min
        self.hit_points = base_hp
        self.current_hp = self.hit_points

    def add_item(self, item):
        if self.inventory is None:
            self.inventory = []
        
        existing_item = Enumerable(self.inventory) \
            .where(lambda x: x.slot == item.slot).first_or_default()
        
        if existing_item is not None:
            self.inventory.remove(existing_item)
        
        self.inventory.append(item)
        self.calc_stats()
        self.save()

    def remove_item(self, item_id):
        if self.inventory is None:
            self.inventory = []

        item = Enumerable(self.inventory) \
            .where(lambda x: x.id == item_id).first_or_default()

        if item is not None:
            self.inventory.remove(item)

        self.calc_stats()
        self.save()

    def save(self, conditional_operator=None, **expected_values):
        self.calc_stats()
        self.updated_at = datetime.utcnow()
        super(CharacterModel, self).save()

    def __repr__(self):
        return json.dumps(dict(self))


if __name__ == "__main__":
    import random

    if not CharacterModel.exists():
        CharacterModel.create_table(read_capacity_units=100, write_capacity_units=100, wait=True)

    character_1 = CharacterModel(name='Angst')

    character_1.save()

    print(character_1)

    character_1.add_item(InventoryItemMap(id=str(uuid4()), slot=1, slot_name='Head', damage=21, crit_chance=.025))
    character_1.save()
    print()
    print(character_1)

    character_1.add_item(InventoryItemMap(id=str(uuid4()), slot=1, slot_name='Head', damage=15, crit_chance=.033))
    character_1.save()
    print()
    print(character_1)