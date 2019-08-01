# items/models.py

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

ItemSlot = {
    1: 'HEAD',
    2: 'CHEST',
    3: 'SHOULDERS',
    4: 'LEGS',
    5: 'WRIST',
    6: 'HANDS',
    7: 'FEET',
    8: 'BACK',
    9: 'RING_1',
    10: 'RING_2',
    11: 'NECK',
    12: 'MAIN_HAND',
    13: 'OFF_HAND',
    14: 'BOTH_HAND',
    15: 'WAIST'
}

ItemQuality = {
    1: 'COMMON',
    2: 'RARE',
    3: 'LEGENDARY'
}

class ItemModel(BaseModel):
    class Meta:
        table_name = os.environ['DYNAMODB_TABLE']
        if 'ENV' in os.environ:
            host = 'http://localhost:8000'
        else:
            region = aws_region
            host = f'https://dynamodb.{aws_region}.amazonaws.com'

    id = UnicodeAttribute(hash_key=True, default=str(uuid4()))
    name = UnicodeAttribute()
    description = UnicodeAttribute(null=True)
    quality = NumberAttribute(default=1)
    quality_name = UnicodeAttribute(default=ItemQuality[1])
    slot = NumberAttribute()
    slot_name = UnicodeAttribute()
    damage = NumberAttribute(default=10)
    stamina = NumberAttribute(default=10)
    crit_chance = NumberAttribute(default=0.01)

    def save(self, conditional_operator=None, **expected_values):
        self.updated_at = datetime.utcnow()
        self.quality_name = ItemQuality[self.quality]
        self.slot_name = ItemSlot[self.slot]

        super(ItemModel, self).save()

if __name__ == "__main__":
    
    if not ItemModel.exists():
        ItemModel.create_table(read_capacity_units=100, write_capacity_units=100, wait=True)

    item_1 = ItemModel(name='Greathelm of Shortmen', slot=1, quality=1, damage=11, stamina=13, crit_chance=0.11)

    item_1.save()

    print(dict(item_1))

    item_2 = ItemModel(name='Shortsword of Tallmen', slot=12, quality=2, damage=35, stamina=15,
                       crit_chance=0.02, description='Hit someone with this and they will know it.')
    
    item_2.save()

    print(dict(item_2))