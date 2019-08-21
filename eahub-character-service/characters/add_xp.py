# characters/add_xp.py

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
    from characters.utils import ModelEncoder


log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def add_xp(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    char_id = event['pathParameters']['id']

    data = json.loads(event.get('body'))

    character = CharacterModel.get(char_id)

    if character is None:
        raise Exception('No character found')

    character.update_xp(data['xp_earned'])

    response = {
        'statusCode': 200,
        'body': json.dumps(character, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(response)}')

    return response
