# fights/claim_loot.py

import os
import json
import logging
from boto3 import client
from py_linq import Enumerable

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
char_add_item_lambda = os.environ['CHAR_ADD_ITEM_SERVICE']
claim_loot_lambda = os.environ['CLAIM_LOOT_SERVICE']
fight_lambda = os.environ['GET_FIGHT_SERVICE']
item_lambda = os.environ['GET_ITEM_SERVICE']

lamba_client = client('lambda', region_name=region)

# request = {
#     'pathParameters': {
#         'id': <fight_id>
#     },
#     body: {
#         'char_id': '',
#     }
# }

def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    try:
        data = json.loads(event.get('body'))

        fight_id = event['pathParameters']['id']
        
        char_id = data['char_id']

        fight_response = lamba_client.invoke(FunctionName=fight_lambda,
                                             InvocationType='RequestResponse',
                                             Payload=json.dumps(event))

        fight_data = json.loads(fight_response.get('Payload').read())
        fight_data = json.loads(fight_data.get('body'))

        char_list = Enumerable(fight_data['characters'])

        # check for character
        char = char_list.first_or_default(lambda c: c['id'] == char_id)

        if char is None:
            raise Exception('Character does not exist for this fight')

        loot_item_id = char.get('loot_item_id', None)
        if loot_item_id is None:
            raise Exception('There is not loot for the character')

        # go out and get the item data
        item_request = {
            'pathParameters': {
                'id': loot_item_id
            }
        }

        item_response = lamba_client.invoke(FunctionName=item_lambda,
                                            InvocationType='RequestResponse',
                                            Payload=json.dumps(item_request))
        
        item_data = json.loads(item_response.get('Payload').read())
        item_data = json.loads(item_data.get('body'))

        # build the request to add an item 
        add_request = {
            'pathParameters': {
                'id': char['id']
            },
            'body': json.dumps({
                'id': loot_item_id,
                'slot': item_data['slot'],
                'slot_name': item_data['slot_name'],
                'damage': item_data['damage'],
                'stamina': item_data['stamina'],
                'crit_chance': item_data['crit_chance']
            })
        }

        add_response = lamba_client.invoke(FunctionName=char_add_item_lambda,
                                           InvocationType='RequestResponse',
                                           Payload=json.dumps(add_request))

        if add_response['StatusCode'] >= 400:
            raise Exception('There was a problem adding the loot for the character')
        
        claim_request = {
            'pathParameters': {
                'id': fight_id
            },
            'body': json.dumps({
                'char_id': char['id']
            })
        }

        claim_response = lamba_client.invoke(FunctionName=claim_loot_lambda,
                                             InvocationType='RequestResponse',
                                             Payload=json.dumps(claim_request))

        if claim_response['StatusCode'] >= 400:
            raise Exception('Tehre was a problem marking the loot as claimed')

        claim_data = json.loads(claim_response.get('Payload').read())

        logger.debug(f'Response: {json.dumps(claim_data)}')

        return claim_data


    except Exception as e:
        if hasattr(e, 'message'):
            logger.error(f'Error: {e.message}')
            return {
            'statusCode': 500,
            'body': json.dumps({
                'error': e.message
            })}
        else:
            logger.error(e)

            return {
                'statusCode': 500,
                'body': json.dumps({
                    'error': 'Could not claim loot.'
                })
        }