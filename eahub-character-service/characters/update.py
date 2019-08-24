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

def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    data = json.loads(event.get('body'))

    char_id = event['pathParameters']['id']

    character = CharacterModel.get(char_id)

    for item in character.inventory:
        item.inv_id = str(uuid4())

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