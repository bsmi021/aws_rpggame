# enemy/models.py

import os
import json
from datetime import datetime
from uuid import uuid4
from enum import Enum;

from pynamodb.attributes import (UnicodeAttribute,
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


class EnemyRaces(Enum):
    ORC = 1
    TROLL = 2
    OGRE = 3
    GNOLL = 4

EnemyInformation = {
    EnemyRaces.ORC.value: { "can_block": True, "can_dodge": True, "base_hp": 1000, "block_pct": 0.075, "block_amt": 0.40, "dodge_pct": 0.02},
    EnemyRaces.TROLL.value: { "can_block": True, "can_dodge": True, "base_hp": 750, "block_pct": 0.035, "block_amt": 0.22, "dodge_pct": 0.075},
    EnemyRaces.OGRE.value: { "can_block": True, "can_dodge": False, "base_hp": 2000, "block_pct": 0.05, "block_amt": 0.57, "dodge_pct": 0.00 },
    EnemyRaces.GNOLL.value: { "can_block": False, "can_dodge": True, "base_hp": 500, "block_pct": 0.00, "block_amt": 0.0, "dodge_pct": 0.02 }
}

EnemyStatus = {
    1: 'ALIVE',
    2: 'DEAD',
    3: 'FAILED'
}

class EnemyModel(BaseModel):
    class Meta:
        table_name = os.environ['DYNAMODB_TABLE']
        if 'ENV' in os.environ:
            host = 'http://localhost:8000'
        else:
            region = aws_region
            host = f'https://dynamodb.{aws_region}.amazonaws.com'

    id = UnicodeAttribute(hash_key=True, null=False)
    #name = UnicodeAttribute()
    level = NumberAttribute(default=1)
    base_hp = NumberAttribute(default=0)
    hit_points = NumberAttribute(default=0)
    current_hp = NumberAttribute(default=0)
    previous_hp = NumberAttribute(default=0)
    status = UnicodeAttribute()
    en_race = NumberAttribute()
    en_race_name = UnicodeAttribute()
    can_block = BooleanAttribute(default=False)
    can_dodge = BooleanAttribute(default=False)
   
    block_pct = NumberAttribute(default=.18)
    block_amt = NumberAttribute(default=.57)
    dodge_pct = NumberAttribute(default=.08)



    def update_hp(self, attack_amt):

        if self.status == 'DEAD':
            raise Exception('Cannot attack a dead enemy')

        if (self.current_hp - attack_amt) >= 0:
            self.current_hp = self.current_hp - attack_amt
        else:
            self.current_hp = 0
            self.status = 'DEAD'


    def set_attributes(self):
        race_attributes = EnemyInformation[self.en_race]

        
        self.base_hp = race_attributes['base_hp']
        self.can_block = race_attributes['can_block']
        self.can_dodge = race_attributes['can_dodge']
        self.block_amt = race_attributes['block_amt']
        self.block_pct = race_attributes['block_pct']
        self.dodge_pct = race_attributes['dodge_pct']

        self.hit_points = round(((self.base_hp * (1 + self.level * .1)) * 3.1))
        self.current_hp = self.hit_points
        self.previous_hp = self.hit_points


  
    def save(self, conditional_operator=None, **expected_values):

        if self.status is None or self.status is "":
            self.status = 'ALIVE'
            self.en_race_name = EnemyRaces(self.en_race).name
            self.set_attributes()


        self.updated_at = datetime.utcnow()
        super(EnemyModel, self).save()

    def __repr__(self):
        return json.dumps(dict(self))

if __name__ == "__main__":
    if not EnemyModel.exists():
        EnemyModel.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)