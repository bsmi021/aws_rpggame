# enemies/get.py

import os
import json
import logging

if 'ENV' in os.environ:
    from models import EnemyModel
    from utils import ModelEncoder
else:
    from enemies.models import EnemyModel
    from enemies.utils import ModelEncoder


log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

def get(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    id = event['pathParameters']['id']

    enemy = EnemyModel.get(id)

    response = {
        'statusCode': 200,
        'body': json.dumps(enemy, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response