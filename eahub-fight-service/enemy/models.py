# enemy/models.py

import os
import json
from datetime import datetime
from uuid import uuid4

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

class EnemyModel(BaseModel):
    class Meta:
        table_name = os.environ['ENEMY_TABLE']
        if 'ENV' in os.environ:
            host = 'http://localhost:8000'
        else:
            region = aws_region
            host = f'https://dynamodb.{aws_region}.amazonaws.com'

    id = UnicodeAttribute(hash_key=True, null=False, default=str(uuid4()))
    name = UnicodeAttribute()
    base_hp = NumberAttribute(default=10000)
    current_hp = NumberAttribute(default=10000)
    status = UnicodeAttribute()
    en_class = UnicodeAttribute()
    en_race = UnicodeAttribute()
    realm = UnicodeAttribute()
    can_block = BooleanAttribute(default=False)
    can_dodge = BooleanAttribute(default=False)
    block_chance = NumberAttribute(default=.18)
    block_amount = NumberAttribute(default=.57)
    dodge_chance = NumberAttribute(default=.08)

    def update_hp(self, attack_amt):

        if self.status == 'DEAD':
            raise Exception('Cannot attack a dead enemy')

        if (self.current_hp - attack_amt) >= 0:
            self.current_hp = self.current_hp - attack_amt
        else:
            self.current_hp = 0
            self.status = 'DEAD'

    def create():
        """Creates and saves a new enemy

        
        Returns:
            EnemyModel -- [description]
        """
        enemy = EnemyModel(name=str(uuid4()),
                           en_class='Orc',
                           en_race='Mage',
                           realm=str(uuid4()))
        enemy.status = 'ALIVE'
        enemy.current_hp = enemy.base_hp
        enemy.save()

        return enemy

    def save(self, conditional_operator=None, **expected_values):
        self.updated_at = datetime.utcnow()
        super(EnemyModel, self).save()

    def __repr__(self):
        return json.dumps(dict(self))

if __name__ == "__main__":
    import random

    def calc_dodge(dodge_chance):
        return random.randint(1, 100) * .01 <= dodge_chance

    def calc_block(block_chance):
        return random.randint(1, 100) * .01 <= block_chance

    def calc_critical(crit_chance):
        return random.randint(1, 100) * .01 <= crit_chance

    def calc_missed():
        return random.randint(1, 100) * .01 <= .042

    if not EnemyModel.exists():
        EnemyModel.create_table(read_capacity_units=100, write_capacity_units=100, wait=True)
    
    enemy = EnemyModel.create()

    print(dict(enemy))

    enemy.update_hp(400)
    enemy.save()

    print(dict(enemy))

    i = 0
    while enemy.status != 'DEAD':
        attack_amt = random.randint(14,44)

        is_missed = calc_missed()
        
        if is_missed:
            attack_amt = 0

        is_critical = calc_critical(.21)

        if is_critical and not is_missed:
            attack_amt = round(attack_amt * 1.5)
        
        is_blocked = calc_block(enemy.block_chance)

        if is_blocked and not is_missed:
            attack_amt = round(attack_amt * enemy.block_amount)

        if not is_blocked and not is_missed:
            is_dodged = calc_dodge(enemy.dodge_chance)

            if is_dodged:
                attack_amt = 0

        enemy.update_hp(attack_amt)
        enemy.save()
        
        print(f'Player X strikes for {attack_amt}: {is_critical}')
        #print(dict(enemy))
        i += 1

    print(f'There were {i} attacks')    