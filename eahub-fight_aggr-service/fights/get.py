# fights/get.py
# proxy for getting a fight

import os
import json
import logging
from boto3 import client

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
fight_lambda = os.environ['GET_FIGHT_SERVICE']

lamba_client = client('lambda', region_name=region)

def get (event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    
    fights_response = lamba_client.invoke(FunctionName=fight_lambda,
                                          InvocationType="RequestResponse",
                                          Payload=json.dumps(event))

    fights_data = json.loads(fights_response.get('Payload').read())

    response = {
        'statusCode': 200,
        'body': fights_data['body'],
        'headers': {
            'Access-Control-Allow-Origin':'*'
        }
    }

    logger.debug(f'Event response: {json.dumps(response)}')

    return response