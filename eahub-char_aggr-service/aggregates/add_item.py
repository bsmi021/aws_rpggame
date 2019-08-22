# aggregates/add_item.py

import os
import json
import logging
from boto3 import client

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
item_lambda = os.environ['ITEM_SERVICE']
char_lambda = os.environ['CHAR_ADDITEM_SERVICE']

lambda_client = client('lambda', region_name=region)


def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    char_id = event['pathParameters']['id']
    data = json.loads(event['body'])

    request = {
        'pathParameters': {
            'id': data['id']
        }
    }

    invoke_response = lambda_client.invoke(FunctionName=item_lambda,
                                           InvocationType='RequestResponse',
                                           Payload=json.dumps(request))

    data = json.loads(invoke_response.get('Payload').read())

    data = json.loads(data['body'])

    event['body'] = json.dumps(
        {
            'id': data['id'],
            'slot': data['slot'],
            'damage': data['damage'],
            'stamina': data['stamina'],
            'crit_chance': data['crit_chance'],
            'slot_name': data['slot_name']
        }
    )

    invoke_response = lambda_client.invoke(FunctionName=char_lambda,
                                           InvocationType='RequestResponse',
                                           Payload=json.dumps(event))

    response_p = json.loads(invoke_response.get('Payload').read())

    response = {
        'statusCode': 200,
        'body': response_p['body'],
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response
