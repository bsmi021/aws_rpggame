# characters/list.py

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

def list(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    characters = CharacterModel.scan()

    response = {
        'statusCode': 200,
        'body': json.dumps(
            {
                "characters": [x for x in characters]
                }
            , cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response