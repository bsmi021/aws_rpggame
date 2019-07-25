# items/list.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4

if 'ENV' in os.environ:
    from models import ItemModel
else:
    from items.models import ItemModel

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

def list(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    results = ItemModel.scan()

    response = {
        'statusCode': 200,
        'body': json.dumps(
            {
                "items": [dict(x) for x in results]
                }
            ),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response