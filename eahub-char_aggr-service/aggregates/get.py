# aggregates/get.py

import os
import json
import logging
from boto3 import client

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
item_lambda = os.environ['ITEM_SERVICE']
char_lambda = os.environ['GET_CHAR_SERVICE']

lambda_client = client('lambda', region_name=region)


def get(event, context):
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

    for item in char_inventory:
        item_id = item['id']

        request = {
            'pathParameters': {
                'id': item_id
            }
        }

        invoke_response = lambda_client.invoke(FunctionName=item_lambda,
                                               InvocationType='RequestResponse',
                                               Payload=json.dumps(request))

        i_data = json.loads(invoke_response.get('Payload').read())
        i_data = json.loads(i_data['body'])

        inventory.append(i_data)

    data['inventory'] = inventory

    response = {
        'statusCode': 200,
        'body': json.dumps(data),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response
