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

def list(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    characters = CharacterModel.scan()

    response = {
        'statusCode': 200,
        'body': json.dumps(
            {
                "characters": [dict(x) for x in characters]
                }
            )
    }

    return response