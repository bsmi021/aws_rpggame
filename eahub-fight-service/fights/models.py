# fights/models.py

import time
import random
import os
import json
from datetime import datetime
from uuid import uuid4
from enum import Enum

from pynamodb.attributes import (UnicodeAttribute,
                                 BooleanAttribute,
                                 UTCDateTimeAttribute,
                                 NumberAttribute,
                                 ListAttribute,
                                 JSONAttribute,
                                 MapAttribute)
from pynamodb.models import Model

aws_region = os.environ.get('REGION', 'none')


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


class Enemy (MapAttribute):
    id = UnicodeAttribute()
    can_block = BooleanAttribute()
    can_dodge = BooleanAttribute()
    block_amt = NumberAttribute()
    block_pct = NumberAttribute()
    dodge_pct = NumberAttribute()
    base_hp = NumberAttribute()
    curr_hp = NumberAttribute()
    prev_hp = NumberAttribute()
    status = UnicodeAttribute(default="ALIVE")


class Character (MapAttribute):
    id = UnicodeAttribute()
    attack_speed = NumberAttribute()
    crit_chance = NumberAttribute()
    curr_hp = NumberAttribute()
    prev_hp = NumberAttribute()
    status = UnicodeAttribute(default='ALIVE')
    min_damage = NumberAttribute()
    max_damage = NumberAttribute()


class FightModel(BaseModel):
    class Meta:
        table_name = os.environ.get('FIGHT_TABLE', 'FIGHTS')
        if 'ENV' in os.environ:
            host = 'http://localhost:8000'
        else:
            region = aws_region
            host = f'https://dynamodb.{aws_region}.amazonaws.com'

    id = UnicodeAttribute(hash_key=True, null=False, default=str(uuid4()))
    is_active = BooleanAttribute(default=True)
    enemy = Enemy()
    characters = ListAttribute(Character)

    def update_enemy_hp(self, attack_amt):
        self.enemy.prev_hp = self.enemy.curr_hp

        if self.enemy.curr_hp - attack_amt <= 0:
            self.enemy.curr_hp = 0
            self.enemy.status = 'DEAD'
        else:
            self.enemy.curr_hp -= attack_amt

        self.save()

    def save(self, conditional_operator=None, **expected_values):
        self.updated_at = datetime.utcnow()
        super(FightModel, self).save()


class AttackModel(BaseModel):
    class Meta:
        table_name = os.environ.get('ATTACK_TABLE', 'ATTACKS')
        if 'ENV' in os.environ:
            host = 'http://localhost:8000'
        else:
            region = aws_region
            host = f'https//dynamodb.{aws_region}.amazonaws.com'

    id = UnicodeAttribute(hash_key=True, null=False, default=str(uuid4()))
    source_id = UnicodeAttribute()
    source_tp = UnicodeAttribute()
    target_id = UnicodeAttribute()
    target_tp = UnicodeAttribute()
    fight_id = UnicodeAttribute()
    attack_amt = NumberAttribute(default=0)
    is_missed = BooleanAttribute(default=False)
    is_critical = BooleanAttribute(default=False)
    is_blocked = BooleanAttribute(default=False)
    block_amt = NumberAttribute(default=0)
    is_dodged = BooleanAttribute(default=0)
    t_curr_hp = NumberAttribute(default=0)
    t_prev_hp = NumberAttribute(default=0)

    def save(self, conditional_operator=None, **expected_values):
        self.id = str(uuid4())
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        super(AttackModel, self).save()
