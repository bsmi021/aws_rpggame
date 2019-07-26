# characters/create.py

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


def create(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    data = json.loads(event.get('body'))

    character = CharacterModel(id=str(uuid4()),
                               name=data.get('name'),
                               account=data.get('account', 'None'),
                               created_at=datetime.utcnow())

    character.save()

    response = {
        'statusCode': 200,
        'body': json.dumps(character, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(response)}')

    return response






