# fights/fightUpdateHandler.py

import os
import json
import logging
from boto3 import client
from py_linq import Enumerable
import random

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
create_loot_lambda = os.environ['CREATE_LOOT_SERVICE']
items_lambda = os.environ['LIST_ITEM_SERVICE']

lambda_client = client('lambda', region_name=region)
# this is a dynamodb stream trigger which will update the XP for the
# characters in the party


def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    records = event['Records']  # json.loads(event['Records'])

    for record in records:
        # make sure dynamodb is in the record otherwise dont' process
        if ('dynamodb' in record):
            # make sure this is an update, don't care for an insert an update has an OldImage and NewImage of the record changed
            if ('OldImage' in record['dynamodb'] and 'NewImage' in record['dynamodb']):
                new_image = record['dynamodb']['NewImage']
                old_image = record['dynamodb']['OldImage']

                is_dead = new_image['enemy']['M']['status']['S'] == 'DEAD'

                # only process if this is the update where the enemy died
                if (is_dead and old_image['enemy']['M']['status']['S'] != 'DEAD'):
                    enemy = new_image['enemy']['M']
                    
                    enemy_request = {
                        'pathParameters': {
                            'id': enemy['id']['S']
                        }
                    }

                    # gotta get the enemy level to calc xp
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

                        # update the xp for the character
                        xp_response = lambda_client.invoke(FunctionName=xp_lambda,
                                                           InvocationType="Event",
                                                           Payload=json.dumps(xp_request))

                        if char_level == 1:
                            continue
                            
                        # now get items that can be given as loot
                        items_request = {
                            'queryStringParameters': {
                                'player_class': char_data['player_class'],
                                'level': char_level
                            }
                        }

                        logger.info(items_request)

                        item_response = lambda_client.invoke(FunctionName=items_lambda,
                                                             InvocationType="RequestResponse",
                                                             Payload=json.dumps(items_request))

                        logger.info(item_response)

                        items_data = json.loads(item_response.get('Payload').read())
                        items_data = json.loads(items_data.get('body'))

                        item = random.choice(items_data['items'])

                        if item is not None:
                            cr_request = {
                                'pathParameters': {
                                    'id': new_image['id']['S']
                                },
                                'body': json.dumps([
                                    {
                                        'char_id': char_data['id'],
                                        'item_id': item['id']
                                    }]
                                )
                            }

                            # create some loot
                            create_response = lambda_client.invoke(FunctionName=create_loot_lambda,
                                                                   InvocationType='Event',
                                                                   Payload=json.dumps(cr_request))

                            if create_response['StatusCode'] >= 400:
                                logger.error("Could not create loot")

