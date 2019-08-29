# enemies/create.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4

if 'ENV' in os.environ:
    from models import EnemyModel, EnemyRaceModel
    from utils import ModelEncoder, get_body, create_response
else:
    from enemies.models import EnemyModel, EnemyRaceModel
    from enemies.utils import ModelEncoder, get_body, create_response

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def create(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    try:
        data = get_body(event, logger)

        en_race_id = data['race']

        en_race = EnemyRaceModel.get(en_race_id)

        enemy = EnemyModel(id=str(uuid4()),
                        # realm=str(uuid4()),
                        status="",
                        level=data['level'],
                        en_race=en_race_id,
                        en_race_name=en_race.en_race_name,
                        base_hp=en_race.base_hp,
                        can_block=en_race.can_block,
                        can_dodge=en_race.can_dodge,
                        block_amt=en_race.block_amt,
                        block_pct=en_race.block_pct,
                        dodge_pct=en_race.dodge_pct,
                        base_ap=en_race.base_ap,
                        ap_mult=en_race.ap_mult,
                        attack_speed=en_race.attack_speed,
                        can_crit=en_race.can_crit,
                        crit_chance=en_race.crit_chance,
                        created_at=datetime.utcnow())

        enemy.save()

        response = create_response(200, json.dumps(enemy, cls=ModelEncoder))
        # {
        #     'statusCode': 200,
        #     'body': json.dumps(enemy, cls=ModelEncoder),
        #     'headers': {
        #         'Access-Control-Allow-Origin': '*'
        #     }
        # }

        logger.debug(f'Response: {json.dumps(response)}')

        return response
    except Exception as ex:
        logger.error(f'There was an error creating the enemy: {ex}')
        return create_response(500, {'error': 'Unable to create the enemy'})