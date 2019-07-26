# characters/tests.py

import os
import json
from uuid import uuid4

os.environ['ENV'] = '1'
os.environ['REGION'] = 'us-east-2'
os.environ['DYNAMODB_TABLE'] = 'CHARS'

from create import create
from add_item import add_item
from remove_item import remove_item
from get import get
from list import list
from models import CharacterModel, InventoryItemMap

if __name__ == "__main__":

    if not CharacterModel.exists():
        CharacterModel.create_table(read_capacity_units=100, write_capacity_units=100, wait=True)

    request = {
        'body': json.dumps({
            'name': 'Edge'
        })
    }

    response = create(request, None)

    print('Created character')
    print(response)

    char_id = json.loads(response['body'])['id']

    print()

    request = {
        'pathParameters': {'id': json.loads(response['body'])['id']},
        'body': json.dumps({
            'id': str(uuid4()),
            'slot': 1,
            'slot_name': 'HEAD',
            'damage': 25,
            'crit_chance': .033,
            'stamina': 15
        })
        }

    response = add_item(request, None)
    print('Added first item')
    print(response)
    print()

    item_id = str(uuid4())
    request = {
        'pathParameters': {'id': json.loads(response['body'])['id']},
        'body': json.dumps({
            'id': item_id,
            'slot': 2,
            'slot_name': 'CHEST',
            'damage': 40,
            'crit_chance': .013,
            'stamina': 5
        })
        }

    response = add_item(request, None)

    print('Add second item')
    print(response)
    print()

    print(f'Removing item: {item_id}')

    request = {
        'pathParameters': {'id': json.loads(response['body'])['id']},
        'body': json.dumps({
            'id': item_id
        })
        }

    response = remove_item(request, None)

    print(response)
    
    request = {
        'pathParameters': {
            'id': char_id
        }
        
    }

    character = get(request, None)

    print()
    print()
    print(character['body'])

    print()
    print('All characters')

    response = list(None, None)

    print(response)


    
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


    