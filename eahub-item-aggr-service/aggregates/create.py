# aggregates/create.py

import os
import json
import logging
from boto3 import client

if 'ENV' in os.environ:
    import itemCalculations
else:
    import aggregates.itemCalculations as itemCalculations

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
item_lambda = os.environ['CREATE_ITEM_SERVICE']

lambda_client = client('lambda', region_name=region)

def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    data = json.loads(event.get('body'))
    items = []

    for i in range(1, 4, 1):
        item = {
            'name': data.get('name'),
            'slot': data.get('slot'),
            'quality': data.get('quality'),
            'description': data.get('description'),
            'is_archer': data.get('is_archer', False),
            'is_warrior': data.get('is_warrior', False),
            'is_sorcerer': data.get('is_sorcerer', False),
            'is_rogue': data.get('is_rogue', False),
            'level': data.get('level')
        }

        item['damage'] = itemCalculations.calc_attack_power(item['level'], i)
        item['crit_chance'] = itemCalculations.calc_crit_chance(item['level'], i)
        item['stamina'] = itemCalculations.calc_stamina(item['level'], i)
        item['quality'] = i

        request = {
            'body': json.dumps(item)
        }

        invoke_response = lambda_client.invoke(FunctionName=item_lambda,
                                           InvocationType='RequestResponse',
                                           Payload=json.dumps(request))
        
        new_item = json.loads(invoke_response.get('Payload').read())
        
        if invoke_response['StatusCode'] > 400:
            raise Exception(new_item)

        items.append(json.loads(new_item['body']))

        if item['level'] <= 3:
            break
    
    response = {
        'statusCode': 200,
        'body': json.dumps(items),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response {json.dumps(response)}')

    return response