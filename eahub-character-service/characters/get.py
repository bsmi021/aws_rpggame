# items/get.py

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

def get(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    char_id = event['pathParameters']['id']

    character = CharacterModel.get(char_id)

    response = {
        'statusCode': 200,
        'body': json.dumps(dict(character)),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response