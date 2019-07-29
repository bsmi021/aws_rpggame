# enemies/create.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4

if 'ENV' in os.environ:
    from models import EnemyModel
    from utils import ModelEncoder
else:
    from enemies.models import EnemyModel
    from enemies.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def create(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    data = json.loads(event.get('body'))

    enemy = EnemyModel(id=str(uuid4()),
                       # realm=str(uuid4()),
                       status="",
                       level=data['level'],
                       en_race=data['race'],
                       created_at=datetime.utcnow())

    enemy.save()

    response = {
        'statusCode': 200,
        'body': json.dumps(enemy, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(response)}')

    return response
