# fights/pattack.py
# proxy class for attack

# request model 
# {
#     "pathParameters": {
#         "id": <fight_id>
#     },
#     "body": {
#         "character_id": <character_id>
#     }
# }

import os
import json
import logging
from boto3 import client

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
attack_lambda = os.environ['ATTACK_SERVICE']

lamba_client = client('lambda', region_name=region)

def attack (event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    #char_id = event['pathParameters']['id']
    data = json.loads(event['body'])

    attack_request = {
        "pathParameters": {
            "id": data['fight_id'],
        },
        "body": json.dumps({
            "character_id": data['character_id']
        })
    }

    attack_response = lamba_client.invoke(FunctionName=attack_lambda,
                                          InvocationType="RequestResponse",
                                          Payload=json.dumps(attack_request))

    attack_data = json.loads(attack_response.get('Payload').read())

    # TODO: Add logic for when the enemy is already dead
    # TODO: Handle non 200 errors
    # build the response object
    response = {
        'statusCode': 200,
        'body': attack_data['body'],
        'headers': {
            'Access-Control-Allow-Origin':'*'
        }
    }

    return response