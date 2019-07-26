# characters/remove_item.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4

if 'ENV' in os.environ:
    from models import CharacterModel, InventoryItemMap
else:
    from characters.models import CharacterModel, InventoryItemMap

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)



def remove_item(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    char_id = event['pathParameters']['id']
    data = json.loads(event.get('body'))

    character = CharacterModel.get(char_id)

    if character is None:
        raise Exception('No character found')

    character.remove_item(data.get('id'))

    response = {
        'statusCode': 200,
        'body': json.dumps(dict(character)),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(event)}')

    return response

