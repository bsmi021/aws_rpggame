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


EnemyStatus = {
    1: 'ALIVE',
    2: 'DEAD',
    3: 'FAILED'
}

class EnemyRaceModel(BaseModel):
    class Meta:
        table_name = os.environ.get('EN_RACE_TABLE', 'ENEMYRACES')
        if 'ENV' in os.environ:
            host = 'http://localhost:8000'
        else:
            region = aws_region
            host = f'https://dynamodb.{aws_region}.amazonaws.com'

    en_race_id = NumberAttribute(hash_key=True, null=False)
    en_race_name = UnicodeAttribute(null=False)
    base_hp = NumberAttribute(default=0)
    can_block = BooleanAttribute(default=False)
    can_dodge = BooleanAttribute(default=False)
   
    block_pct = NumberAttribute(default=0.0)
    block_amt = NumberAttribute(default=0.0)
    dodge_pct = NumberAttribute(default=0.0)

    can_crit = BooleanAttribute(default=False)
    crit_chance = NumberAttribute(default=0)
    # base attack power
    base_ap = NumberAttribute(default=0)
    ap_mult = NumberAttribute(default=0)
    attack_speed = NumberAttribute(default=0)

    def save(self, conditional_operator=None, **expected_values):
        self.updated_at = datetime.utcnow()
        super(EnemyRaceModel, self).save()

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
    base_ap = NumberAttribute(default=0)
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

    can_crit = BooleanAttribute(default=False)
    crit_chance = NumberAttribute(default=0)
    # base attack power
    base_ap = NumberAttribute(default=0)
    ap_mult = NumberAttribute(default=0)
    attack_pwr = NumberAttribute(default=0)
    min_damage = NumberAttribute(default=0)
    max_damage = NumberAttribute(default=0)
    attack_speed = NumberAttribute(default=0)

    def update_hp(self, attack_amt):

        if self.status == 'DEAD':
            raise Exception('Cannot attack a dead enemy')

        if (self.current_hp - attack_amt) >= 0:
            self.current_hp = self.current_hp - attack_amt
        else:
            self.current_hp = 0
            self.status = 'DEAD'


    def set_attributes(self):
        # race_attributes = EnemyInformation[self.en_race]

        
        # self.base_hp = race_attributes['base_hp']
        # self.can_block = race_attributes['can_block']
        # self.can_dodge = race_attributes['can_dodge']
        # self.block_amt = race_attributes['block_amt']
        # self.block_pct = race_attributes['block_pct']
        # self.dodge_pct = race_attributes['dodge_pct']

        self.attack_pwr = round(((self.base_ap * (1 + self.level * .1)) * self.ap_mult))
        self.min_damage = round(self.attack_pwr / 4.75)
        self.max_damage = round(self.attack_pwr / 2)
        self.hit_points = round(((self.base_hp * (1 + self.level * .1)) * 3.1))
        self.current_hp = self.hit_points
        self.previous_hp = self.hit_points


  
    def save(self, conditional_operator=None, **expected_values):

        if self.status is None or self.status is "":
            self.status = 'ALIVE'
            #self.en_race_name = EnemyRaces(self.en_race).name
            self.set_attributes()


        self.updated_at = datetime.utcnow()
        super(EnemyModel, self).save()

    def __repr__(self):
        return json.dumps(dict(self))

if __name__ == "__main__":
    
    results = EnemyRaceModel.scan()

    orc = EnemyRaceModel(en_race_id=1, en_race_name='ORC', base_hp=650, block_amt=0.40, block_pct=0.075, dodge_pct=0.07, can_block=True, can_dodge=True, base_ap=55, ap_mult=3.1, can_crit=True, crit_chance=0.10, attack_speed=2100)
    orc.save()

    troll = EnemyRaceModel(en_race_id=2, en_race_name='TROLL', base_hp=450, block_amt=0.22, block_pct=0.035, dodge_pct=0.115, can_block=True, can_dodge=True, base_ap=45, ap_mult=3.1,can_crit=True, crit_chance=0.15, attack_speed=1700)
    troll.save()

    ogre = EnemyRaceModel(en_race_id=3, en_race_name='OGRE', base_hp=815, block_amt=0.57, block_pct=0.05, dodge_pct=0.00, can_block=True, can_dodge=False, base_ap=65, can_crit=True, ap_mult=3.1,crit_chance=0.07, attack_speed=2700)
    ogre.save()

    gnoll = EnemyRaceModel(en_race_id=4, en_race_name='GNOLL', base_hp=350, block_amt=0.00, block_pct=0.00, dodge_pct=0.06, can_block=False, can_dodge=True, base_ap=35, can_crit=True, ap_mult=3.1,crit_chance=0.12, attack_speed=1400)
    gnoll.save()

    gnoll2 = EnemyRaceModel.get(4)

    print(gnoll2.en_race_name)

    for r in results:
        print(r.en_race_id)

    # if not EnemyModel.exists():
    #     EnemyModel.create_table(read_capacity_units=1, write_capacity_units=1, wait=True)