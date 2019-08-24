# items/list.py

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


def list(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    # query params {level, slot, quality}
    if 'queryStringParameters' in event:
        queryParams = event.get('queryStringParameters', {})

        if queryParams is not None:
            if 'player_class' in queryParams:
                query = None

                if 'level' in queryParams:
                    clause = ItemModel.level == int(queryParams['level'])
                    query = clause if query is None else query & clause

                results = ItemModel.player_class_index.query(
                    int(queryParams['player_class']),query)

            else:
                queryFields = {'slot', 'quality', 'level'}
                query = None

                for fieldName in queryFields:
                    field = getattr(ItemModel, fieldName, None)
                    if field is None or fieldName not in queryParams:
                        continue
                    clause = field == int(queryParams[fieldName])
                    query = clause if query is None else query & clause

                results = ItemModel.scan(query)
        else:
            results = ItemModel.scan()
    else:
        results = ItemModel.scan()

    response = {
        'statusCode': 200,
        'body': json.dumps(
            {
                "items": [x for x in results]
            }, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return response
