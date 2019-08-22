# fights/list_attacks.py

import os
import json
import logging

if 'ENV' in os.environ:
    from models import AttackModel
    from utils import ModelEncoder
else:
    from fights.models import AttackModel
    from fights.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def list(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    fight_id = event['pathParameters']['id']
    query = None

    query = AttackModel.fight_id == fight_id

    if 'queryStringParameters' in event:
        queryParams = event.get('queryStringParameters')

        if queryParams is not None:
            if (queryParams.get('char_id') is not None):
                char_id = queryParams.get('char_id')
                clause = AttackModel.source_id == char_id  # | AttackModel.target_id == char_id
                query = clause if query is None else query & clause

    results = AttackModel.scan(query)

    response = {
        'statusCode': 200,
        'body': json.dumps(
            {
                "attacks": [x for x in results]
            }, cls=ModelEncoder
        ),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(response)}')

    return response
