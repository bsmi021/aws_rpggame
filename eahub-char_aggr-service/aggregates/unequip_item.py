# aggregates/unequip_item.py

import os
import json
import logging
from boto3 import client

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
# item_lambda = os.environ['ITEM_SERVICE']
char_lambda = os.environ['REMOVE_SERVICE']

lambda_client = client('lambda', region_name=region)


def unequip_item(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    char_id = event['pathParameters']['id']
    data = json.loads(event['body'])

    request = {
        'pathParameters': {
            'id': char_id
        },
        'body': event['body']
    }

    invoke_response = lambda_client.invoke(FunctionName=char_lambda,
                                           InvocationType='RequestResponse',
                                           Payload=json.dumps(request))

    response = json.loads(invoke_response.get('Payload').read())

    # response = {
    #     'statusCode': 200,
    #     'body': response['body'],
    #     'headers': {'Access-Control-Allow-Origin': '*'}
    # }

    return response
