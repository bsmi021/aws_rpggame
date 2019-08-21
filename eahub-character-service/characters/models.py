# characters/models.py

import os
import json
from datetime import datetime
from uuid import uuid4
from py_linq import Enumerable
from enum import Enum
if 'ENV' in os.environ:
    import experienceCalcs
else:
    import characters.experienceCalcs as experienceCalcs

from pynamodb.attributes import (UnicodeAttribute,
                                 ListAttribute,
                                 BooleanAttribute,
                                 UTCDateTimeAttribute,
                                 NumberAttribute,
                                 JSONAttribute,
                                 MapAttribute)
from pynamodb.models import Model

aws_region = os.environ['REGION']

class PlayerClass(Enum):
    WARRIOR = 1
    ARCHER = 2
    SORCERER = 3
    ROGUE = 4

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
    player_class = NumberAttribute(default=PlayerClass.WARRIOR.value)
    player_class_name = UnicodeAttribute(default=PlayerClass.WARRIOR.name)
    level = NumberAttribute(default=1)
    xp_gained = NumberAttribute(default=0)
    curr_lvl_xp = NumberAttribute(default=0)
    xp_to_lvl = NumberAttribute(default=0)
    base_damage = NumberAttribute(default=0)
    tot_damage = NumberAttribute(default=0)
    base_min_damage = NumberAttribute(default=2)
    base_max_damage = NumberAttribute(default=8)
    base_crit_chance = NumberAttribute(default=.05)
    base_miss_chance = NumberAttribute(default=.05)
    base_critical_multiplier = NumberAttribute(default=2.5)
    min_damage = NumberAttribute(default=0)
    max_damage = NumberAttribute(default=0)
    crit_chance = NumberAttribute(default=.05)
    hit_points = NumberAttribute(default=100)
    current_hp = NumberAttribute(default=100)
    attack_speed = NumberAttribute(default=0)
    can_dual_wield = BooleanAttribute(default=False)
    can_use_2h = BooleanAttribute(default=False)
    inventory = ListAttribute(of=InventoryItemMap)

    def update_xp(self, xp_earned):
        """Updates the characters xp based on the amount earned
        
        Arguments:
            xp_earned {int} -- Amount of exp earned for killing an enemy
        """

        xp_x = xp_earned + self.curr_lvl_xp
        
        if (xp_x >= self.xp_to_lvl):
            self.level += 1
            print(f"Ding You've Reacted Level: {self.level}")
            self.curr_lvl_xp = xp_x - self.xp_to_lvl
            self.xp_to_lvl = experienceCalcs.xp_required_to_level(self.level)
            self.calc_stats()

            while self.curr_lvl_xp >= self.xp_to_lvl:
                self.level += 1
                print(f"Ding You've Reacted Level: {self.level}")
                self.curr_lvl_xp = xp_x - self.xp_to_lvl
                self.xp_to_lvl = experienceCalcs.xp_required_to_level(self.level)
                self.calc_stats()
        else:
            self.curr_lvl_xp += xp_earned
        

        self.xp_gained += xp_earned
        self.updated_at = datetime.utcnow()
        super(CharacterModel, self).save()

    def calc_stats(self):
        base_min = round(((self.base_min_damage * (1 + self.level * .1)) * 1.55))
        base_max = round(((self.base_max_damage * (1 + self.level * .1)) * 1.55))
        base_crit = self.base_crit_chance
        base_hp = round(((self.base_hp * (1 + self.level * .1)) * 6.5))
        base_damage = self.base_damage

        if self.inventory is not None:
            base_crit += Enumerable(self.inventory) \
                .sum(lambda x: x.crit_chance)
            base_min += Enumerable(self.inventory) \
                .sum(lambda x: round(x.damage / 4.75))
            base_max += Enumerable(self.inventory) \
                .sum(lambda x: round(x.damage / 2))
            base_hp += Enumerable(self.inventory) \
                .sum(lambda x: x.stamina * 10)
            base_damage += Enumerable(self.inventory).sum(lambda x: x.damage)
        else:
            self.inventory = []

        base_crit = int(base_crit * 100) * .01

        self.crit_chance = base_crit
        self.max_damage = base_max
        self.min_damage = base_min
        self.hit_points = base_hp
        self.tot_damage = base_damage
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

    def set_class_attributes(self):
        damage_base = {
            PlayerClass.ARCHER.value: { 'base_damage': 18, 'speed': 1500, 'can_use_2h': True, 'can_dual_wield': False },
            PlayerClass.WARRIOR.value: { 'base_damage': 30, 'speed': 2500, 'can_use_2h': True, 'can_dual_wield': True },
            PlayerClass.SORCERER.value: { 'base_damage': 20, 'speed': 1800, 'can_use_2h': True, 'can_dual_wield': False },
            PlayerClass.ROGUE.value: { 'base_damage': 13, 'speed': 1300, 'can_use_2h': False, 'can_dual_wield': True }
        }

        self.base_min_damage = round(damage_base[self.player_class]['base_damage'] / 4.75)
        self.base_max_damage = round(damage_base[self.player_class]['base_damage'] / 2)
        self.base_damage = damage_base[self.player_class]['base_damage']

        self.attack_speed = damage_base[self.player_class]['speed']
        self.can_dual_wield = damage_base[self.player_class]['can_dual_wield']
        self.can_use_2h = damage_base[self.player_class]['can_use_2h']

        self.player_class_name = PlayerClass(self.player_class).name

        self.xp_to_lvl = experienceCalcs.xp_required_to_level(1)

    def save(self, conditional_operator=None, **expected_values):
        
        self.set_class_attributes()

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

    #print(character_1)

    character_1.add_item(InventoryItemMap(id=str(uuid4()), slot=1, slot_name='Head', damage=21, crit_chance=.025))
    character_1.save()
    print()
   # print(character_1)

    character_1.add_item(InventoryItemMap(id=str(uuid4()), slot=1, slot_name='Head', damage=15, crit_chance=.033))
    character_1.save()
    print()
  #  print(character_1)

    character_1.update_xp(50)
    print(f'lvl: {character_1.level} (hp: {character_1.hit_points} {character_1.min_damage}-{character_1.max_damage}) curr_xp: {character_1.curr_lvl_xp} xp_to_lvl: {character_1.xp_to_lvl} total_xp: {character_1.xp_gained}')
    character_1.update_xp(50)
    print(f'lvl: {character_1.level} (hp: {character_1.hit_points} {character_1.min_damage}-{character_1.max_damage}) curr_xp: {character_1.curr_lvl_xp} xp_to_lvl: {character_1.xp_to_lvl} total_xp: {character_1.xp_gained}')
    character_1.update_xp(65)
    print(f'lvl: {character_1.level} (hp: {character_1.hit_points} {character_1.min_damage}-{character_1.max_damage}) curr_xp: {character_1.curr_lvl_xp} xp_to_lvl: {character_1.xp_to_lvl} total_xp: {character_1.xp_gained}')
    character_1.update_xp(85)
    print(f'lvl: {character_1.level} (hp: {character_1.hit_points} {character_1.min_damage}-{character_1.max_damage}) curr_xp: {character_1.curr_lvl_xp} xp_to_lvl: {character_1.xp_to_lvl} total_xp: {character_1.xp_gained}')
    character_1.update_xp(5000)
    print(f'lvl: {character_1.level} (hp: {character_1.hit_points} {character_1.min_damage}-{character_1.max_damage}) curr_xp: {character_1.curr_lvl_xp} xp_to_lvl: {character_1.xp_to_lvl} total_xp: {character_1.xp_gained}')
    #print(character_1)

    #print(character_1.to_json())

    