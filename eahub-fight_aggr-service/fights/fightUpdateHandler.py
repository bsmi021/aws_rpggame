# fights/fightUpdateHandler.py

import os
import json
import logging
from boto3 import client

if 'ENV' in os.environ:
    import experienceCalcs
else:
    import fights.experienceCalcs as experienceCalcs

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
char_lambda = os.environ['GET_CHAR_SERVICE']
xp_lambda = os.environ['ADD_XP_SERVICE']
enemy_lambda = os.environ['GET_ENEMY_SERVICE']

lambda_client = client('lambda', region_name=region)
# this is a dynamodb stream trigger which will update the XP for the
# characters in the party


def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    records = event['Records']  # json.loads(event['Records'])

    for record in records:
        if ('dynamodb' in record):
            if ('OldImage' in record['dynamodb'] and 'NewImage' in record['dynamodb']):
                new_image = record['dynamodb']['NewImage']
                old_image = record['dynamodb']['OldImage']

                is_dead = new_image['enemy']['M']['status']['S'] == 'DEAD'

                if (is_dead and old_image['enemy']['M']['status']['S'] != 'DEAD'):
                    enemy = new_image['enemy']['M']
                    
                    enemy_request = {
                        'pathParameters': {
                            'id': enemy['id']['S']
                        }
                    }

                    enemy_response = lambda_client.invoke(FunctionName=enemy_lambda,
                                                          InvocationType="RequestResponse",
                                                          Payload=json.dumps(enemy_request))
                    
                    enemy_data = json.loads(enemy_response.get('Payload').read())
                    enemy_data = json.loads(enemy_data['body'])

                    enemy_level = enemy_data['level']

                    for character in new_image['characters']['L']:
                        char_id = character['M']['id']['S']

                        char_request = {
                            'pathParameters': {
                                'id': char_id
                            }
                        }

                        char_response = lambda_client.invoke(FunctionName=char_lambda,
                                                             InvocationType="RequestResponse",
                                                             Payload=json.dumps(char_request))

                        char_data = json.loads(char_response.get('Payload').read())
                        char_data = json.loads(char_data['body'])

                        char_level = char_data['level']

                        xp_earned = experienceCalcs.xp_earned(char_level, enemy_level)

                        xp_request = {
                            'pathParameters': {
                                'id':char_id
                            },
                            'body': json.dumps({
                                'xp_earned': xp_earned
                            })
                        }

                        xp_response = lambda_client.invoke(FunctionName=xp_lambda,
                                                           InvocationType="RequestResponse",
                                                           Payload=json.dumps(xp_request))

                        xp_data = json.loads(xp_response.get('Payload').read())

                        if (xp_data['statusCode'] == 200):
                            logging.info(f'UPDATED XP: Id: {char_id} by {xp_earned}.')

