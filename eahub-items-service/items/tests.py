# items/test.py

import os
import json
from uuid import uuid4

os.environ['ENV'] = '1'
os.environ['REGION'] = 'us-east-2'
os.environ['DYNAMODB_TABLE'] = 'ITEMS'

from create import create
from update import update
from get import get
from list import list

def create_item():
    # test creating an item
    request = {
        'body': json.dumps(
            {
                'name': 'Headress of the Ring',
                'description': 'Very snazzy headware',
                'slot': 1,
                'quality': 3,
                'stamina': 21,
                'crit_chance': .018,
                'damage': 25
            }
        )
    }

    item = create(request, None)

    return item

def update_item(item, damage, stamina, crit_chance):
    item = json.loads(item)

    id = item['id']
    body = {
        'damage': damage,
        'stamina': stamina,
        'crit_chance': crit_chance
    }

    request = {
        'pathParameters': {
            'id': id
        },
        'body': json.dumps(body)
    }

    response = update(request, None)

    return response

if __name__ == "__main__":

    item = create_item()
    print(item)

    #item = json.dumps(item.get('body'))
    
    response = update_item(item['body'], 10, 15, .01)

    print(response)

    id = json.loads(item['body'])['id']
    request = {
        'pathParameters':{
            'id': id
        }
    }
    print(get(request, None))

    print(list(None, None))