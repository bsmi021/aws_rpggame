# items/update.py

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

def update(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    id = event['pathParameters']['id']
    data = json.loads(event.get('body'))

    item = ItemModel.get(id)

    item.crit_chance = data['crit_chance']
    item.damage = data['damage']
    item.stamina = data['stamina']

    item.save()

    response = {
        'statusCode': 200,
        'body': json.dumps(item, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(response)}')

    return response