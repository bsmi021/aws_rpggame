# aggregates/unequip_item.py

import os
import json
import logging
from boto3 import client

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
#item_lambda = os.environ['ITEM_SERVICE']
char_lambda = os.environ['CHAR_UNEQUIP_SERVICE']

lambda_client = client('lambda', region_name=region)

def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    invoke_response = lambda_client.invoke(FunctionName=char_lambda,
                                           InvocationType="RequestResponse",
                                           Payload=json.dumps(event))
    
    response = json.loads(invoke_response.get('Payload').read())

    logger.debug(f'Response: {json.dumps(response)}')

    return response