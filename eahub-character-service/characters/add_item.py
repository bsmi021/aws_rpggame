# characters/add_item.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4

if 'ENV' in os.environ:
    from models import CharacterModel, InventoryItemMap
    from utils import ModelEncoder
else:
    from characters.models import CharacterModel, InventoryItemMap
    from utils import ModelEncoder



log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def add_item(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    char_id = event['pathParameters']['id']

    print(event.get('body'))

    data = json.loads(event.get('body'))

    character = CharacterModel.get(char_id)

    if character is None:
        raise Exception('No character found')

    character.add_item(InventoryItemMap(id=data['id'],
                                        slot=data['slot'],
                                        slot_name=data['slot_name'],
                                        damage=data['damage'],
                                        crit_chance=data['crit_chance']))


    response = {
        'statusCode': 200,
        'body': json.dumps(character, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(event)}')

    return response
