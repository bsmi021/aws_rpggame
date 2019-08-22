# fights/list.py

import os
import json
import logging

if 'ENV' in os.environ:
    from models import FightModel, Character
    from utils import ModelEncoder
else:
    from fights.models import FightModel, Character
    from fights.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def list(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    query = None
    # query params {enemy_id, char_id, status}
    if 'queryStringParameters' in event:
        queryParams = event.get('queryStringParameters')

        if queryParams is not None:
            if (queryParams.get('enemy_id') is not None):
                clause = FightModel.enemy.id == queryParams.get('enemy_id')
                query = clause if query is None else query & clause

            if (queryParams.get('char_id') is not None):
                clause = FightModel.characters.contains(Character.id==queryParams.get('char_id'))
                query = clause if query is None else query & clause

    results = FightModel.scan(query)

    response = {
        'statusCode': 200,
        'body': json.dumps(
            {
                "fights": [x for x in results]
            }, cls=ModelEncoder
        ),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(response)}')

    return response
