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

if __name__ == "__main__":
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

    print(character)

    print()
    print('All characters')

    response = list(None, None)

    print(response)