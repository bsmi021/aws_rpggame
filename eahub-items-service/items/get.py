# items/get.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4

if 'ENV' in os.environ:
    from models import ItemModel
    from utils import ModelEncoder
else:
    from items.models import ItemModel
    from items.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

def get(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    char_id = event['pathParameters']['id']

    character = ItemModel.get(char_id)

    response = {
        'statusCode': 200,
        'body': json.dumps(character, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response