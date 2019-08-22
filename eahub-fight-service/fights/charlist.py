#fights/charlist.py
import os
import json
import logging

if 'ENV' in os.environ:
    from models import FightModel, Character, CharacterFightModel
    from utils import ModelEncoder
else:
    from fights.models import FightModel, Character, CharacterFightModel
    from fights.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

def list (event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    query = None
    
    results = []
    # query params {enemy_id, char_id, status}
    char_id = event['pathParameters']['id']

    fights = CharacterFightModel.scan(
                    CharacterFightModel.char_id == char_id)

    for c_fight in fights:
        fight = FightModel.get(c_fight.fight_id)

        results.append(fight)

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
#   if (queryParams.get('char_id') is not None):

#                 fights = CharacterFightModel.scan(
#                     CharacterFightModel.char_id == queryParams.get('char_id'))

#                 for fight in fights:
#                     clause = FightModel.id == fight.fight_id
#                     logger.info(f'Fight Id: {fight.fight_id}')
#                     query = clause if query is None else query & clause
#                     logger.info(f'query {query}')