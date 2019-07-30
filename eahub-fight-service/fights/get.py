# fights/get.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4

if 'ENV' in os.environ:
    from models import FightModel
    from utils import ModelEncoder
else:
    from fights.models import FightModel
    from fights.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def get(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    fight_id = event['pathParameters']['id']

    fight = FightModel.get(fight_id)

    response = {
        'statusCode': 200,
        'body': json.dumps(fight, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response
