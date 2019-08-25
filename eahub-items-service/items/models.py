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
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex

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


class PlayerClassViewIndex(GlobalSecondaryIndex):
    class Meta:
        
        read_capacity_units = 5
        write_capacity_units = 5
        projection = AllProjection()
        index_name = 'player_class-level-index'

    player_class = NumberAttribute(default=0, hash_key=True)
    level = NumberAttribute(default=0, range_key=True)

class LevelViewIndex(GlobalSecondaryIndex):
    class Meta:
        read_capacity_units = 5
        write_capacity_units = 5
        projection = AllProjection()
        index_name = 'level-player_class-index'
    
    level = NumberAttribute(default=0, hash_key=True)
    player_class = NumberAttribute(default=0, range_key=True)

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
    level = NumberAttribute(default=1)
    is_warrior = BooleanAttribute(default=False)
    is_sorcerer = BooleanAttribute(default=False)
    is_rogue = BooleanAttribute(default=False)
    is_archer = BooleanAttribute(default=False)
    player_class = NumberAttribute(default=0)

    player_class_index = PlayerClassViewIndex()
    level_index = LevelViewIndex()

    def save(self, conditional_operator=None, **expected_values):
        self.updated_at = datetime.utcnow()
        self.quality_name = ItemQuality[self.quality]
        self.slot_name = ItemSlot[self.slot]

        super(ItemModel, self).save()


if __name__ == "__main__":

    # if not ItemModel.exists():
    #    ItemModel.create_table(read_capacity_units=100, write_capacity_units=100, wait=True)
    import time
    import json

    def get_player_class(item):
        if item.is_warrior:
            return 1
        elif item.is_rogue:
            return 4
        elif item.is_sorcerer:
            return 3
        elif item.is_archer:
            return 2
        else:
            return 0

    last_evalutated_key = None
    results = ItemModel.player_class_index.query(1, ItemModel.level == 1, limit=5, page_size=5, last_evaluated_key=last_evalutated_key, scan_index_forward=True)
    results = ItemModel.player_class_index.query(1, ItemModel.level == 1, limit=5, page_size=5, last_evaluated_key=last_evalutated_key)
    
    print(results.last_evaluated_key)
    print(last_evalutated_key)

    for r in results:
        print(r.name)


    results = ItemModel.player_class_index.scan(last_evaluated_key=last_evalutated_key, limit=100, page_size=5)

    print(last_evalutated_key)

    from utils import ModelEncoder
    import rapidjson
    import pickle

    print(datetime.utcnow())
    results = ItemModel.player_class_index.query(1)

    result = {
        'statusCode': 200,
        'body':
        json.dumps([r for r in results], cls=ModelEncoder)}
    print(datetime.utcnow())

    #print(result)

    # results = ItemModel.player_class_index.query(1)

    # for r in results:
    #     if r.player_class == 0 or r.player_class is None:
    #         r.player_class = get_player_class(r)
    #         r.save()
    #         time.sleep(.25)
    # item_1 = ItemModel(name='Greathelm of Shortmen', slot=1, quality=1, damage=11, stamina=13, crit_chance=0.11)

    # item_1.save()

    # print(dict(item_1))

    # item_2 = ItemModel(name='Shortsword of Tallmen', slot=12, quality=2, damage=35, stamina=15,
    #                    crit_chance=0.02, description='Hit someone with this and they will know it.')

    # item_2.save()

    # print(dict(item_2))
