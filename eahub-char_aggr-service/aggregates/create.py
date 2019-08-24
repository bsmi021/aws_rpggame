# aggregates/create.py

import os
import json
import logging
from py_linq import Enumerable
from boto3 import client
import time

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
item_lambda = os.environ['LIST_ITEM_SERVICE']
create_char_lambda = os.environ['CHAR_CREATE_SERVICE']
get_char_lamba = os.environ['GET_CHAR_SERVICE']
add_lambda = os.environ['CHAR_ADDITEM_SERVICE']
equip_lambda = os.environ['CHAR_EQUIP_SERVICE']

lambda_client = client('lambda', region_name=region)


def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    try:
        cr_char_response = lambda_client.invoke(FunctionName=create_char_lambda,
                                                InvocationType='RequestResponse',
                                                Payload=json.dumps(event))

        cr_data = json.loads(cr_char_response.get('Payload').read())
        cr_data = json.loads(cr_data['body'])

        level = 1
        player_class = cr_data['player_class']

        item_request = {
            'queryStringParameters':{
            'player_class': int(player_class),
            'level': int(level)}
        }

        item_response = lambda_client.invoke(FunctionName=item_lambda,
                                                InvocationType='RequestResponse',
                                                Payload=json.dumps(item_request))

        item_data = json.loads(item_response.get('Payload').read())
        item_data = json.loads(item_data.get('body'))

        items = Enumerable(item_data['items'])
        logger.info(f'Item Count {items.count()}')
        for item in items:
            add_request = {
                'pathParameters': {
                    'id': cr_data['id']
                },
                'body': json.dumps({
                    'id': item['id'],
                    'slot': item['slot'],
                    'damage': item['damage'],
                    'stamina': item['stamina'],
                    'crit_chance': item['crit_chance'],
                    'slot_name': item['slot_name']

                })
            }

            add_response = lambda_client.invoke(FunctionName=add_lambda,
                                                InvocationType='RequestResponse',
                                                Payload=json.dumps(add_request))
            add_data = json.loads(add_response.get('Payload').read())
            logger.info(f'Add Data: {json.dumps(add_data)}')
    # time.sleep(.25)

        logger.info('Items added reloading char')
        char_request = {
            'pathParameters': {
                'id': cr_data['id']
            }
        }

        char_response = lambda_client.invoke(FunctionName=get_char_lamba,
                                                InvocationType='RequestResponse',
                                                Payload=json.dumps(char_request))
        char_data = json.loads(char_response.get('Payload').read())
        char_data = json.loads(char_data.get('body'))

        inventory = char_data['inventory']

        logger.info('Equipping items')
        for inv_item in inventory:
            equip_request = {
                'pathParameters': {'id': char_data['id']},
                'body': json.dumps({'inv_id': inv_item['inv_id']})
            }
            equip_response = lambda_client.invoke(FunctionName=equip_lambda,
                                                    InvocationType='RequestResponse',
                                                    Payload=json.dumps(equip_request))
            equip_data = json.loads(equip_response.get('Payload').read())
            logging.info(f'Response: {json.dumps(equip_data)}')
        #time.sleep(.5)

        logger.info('Reloading Char')
        char_response = lambda_client.invoke(FunctionName=get_char_lamba,
                                                InvocationType='RequestResponse',
                                                Payload=json.dumps(char_request))
        char_data = json.loads(char_response.get('Payload').read())

        response = {
            'statusCode': 200,
            'body': char_data.get('body'),
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }

        logger.info(f'Created new character: {json.dumps(response)}')
            
        return response

    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({
                'error': e
            }),
            "headers": {
                'Access-Control-Allow-Origin': '*'
            }
        }
