# aggregates/get.py

import os
import json
import logging
from py_linq import Enumerable
from boto3 import client

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
item_lambda = os.environ['LIST_ITEM_SERVICE']
char_lambda = os.environ['GET_CHAR_SERVICE']

lambda_client = client('lambda', region_name=region)


def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    char_id = event['pathParameters']['id']

    request = {
        'pathParameters': {
            'id': char_id
        }
    }

    invoke_response = lambda_client.invoke(FunctionName=char_lambda,
                                           InvocationType='RequestResponse',
                                           Payload=json.dumps(request))

    data = json.loads(invoke_response.get('Payload').read())

    data = json.loads(data['body'])

    char_inventory = data['inventory']
    inventory = []
    items_data = []

    
    request = {
        'queryStringParameters':{'player_class': int(data['player_class']),}
    }

    invoke_response = lambda_client.invoke(FunctionName=item_lambda, InvocationType='RequestResponse', Payload=json.dumps(request))

    item_data = json.loads(invoke_response.get('Payload').read())
    item_data = json.loads(item_data.get('body'))

    #items_data.append(item_data)
    #print(len(item_data))

    items = Enumerable(item_data['items'])
    print(items.count())
    for inv_item in char_inventory:
        item_id = inv_item['id']
        item = items.first_or_default(lambda x: x['id'] == item_id)

        if not item:
            continue
        
        item = {
            'id': inv_item['id'],
            'inv_id': inv_item.get('inv_id', ''),
            'equipped': inv_item['equipped'],
            'stamina': item['stamina'],
            'damage': item['damage'],
            'crit_chance': item['crit_chance'],
            'name': item['name'],
            'description': item['description'],
            'quality': item['quality'],
            'quality_name': item['quality_name'],
            'slot': item['slot'],
            'slot_name': item['slot_name'],
            'level': item['level'],
            # 'is_archer': item['is_archer'],
            # 'is_warrior': item['is_warrior'],
            # 'is_rogue': item['is_rogue'],
            # 'is_sorcerer': item['is_sorcerer']
            }

        inventory.append(item)
   
    data['inventory'] = inventory

    response = {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response
