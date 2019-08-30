# fights/create.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4

if 'ENV' in os.environ:
    from models import FightModel, Character, Enemy, CharacterFightModel
    from utils import ModelEncoder
else:
    from fights.models import FightModel, Character, Enemy, CharacterFightModel
    from fights.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def _get_response(status_code, body):
    if not isinstance(body, str):
        body = json.dumps(body)
    else:
        return {'statusCode': status_code,
                'body': body,
                'headers': {
                    'Access-Control-Allow-Origin': '*'
                }
                }


def _get_body(event):
    """ parses the event for a body """
    try:
        return json.loads(event.get('body', ''))
    except:
        logger.debug('event body could not be json decoded')
        return {}


def create(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    data = _get_body(event)

    try:
        characters = data['characters']

        character_list = [Character(id=x['id'],
                                    attack_speed=x['attack_speed'],
                                    crit_chance=x['crit_chance'],
                                    curr_hp=x['curr_hp'],
                                    prev_hp=x['curr_hp'],
                                    base_hp=x['curr_hp'],
                                    min_damage=x['min_damage'],
                                    max_damage=x['max_damage'])
                          for x in characters]

        fight = FightModel(id=str(uuid4()), created_at=datetime.utcnow(),
                           characters=character_list, connectionId=data.get('connectionId', ''))

        enemy_data = data['enemy']
        enemy = Enemy(id=enemy_data['id'],
                      can_block=enemy_data['can_block'],
                      can_dodge=enemy_data['can_dodge'],
                      block_amt=enemy_data['block_amt'],
                      block_pct=enemy_data['block_pct'],
                      dodge_pct=enemy_data['dodge_pct'],
                      base_hp=enemy_data['hit_points'],
                      curr_hp=enemy_data['hit_points'],
                      prev_hp=enemy_data['hit_points'],
                      min_damage=enemy_data.get('min_damage', 0),
                      max_damage=enemy_data.get('max_damage', 0),
                      can_crit=enemy_data.get('can_crit', False),
                      crit_chance=enemy_data.get('crit_chance', 0),
                      attack_speed=enemy_data.get('attack_speed', 0))

        fight.enemy = enemy

        fight.save()

        for char in fight.characters:
            char_fight = CharacterFightModel(char_id=char.id, fight_id=fight.id, enemy_id=fight.enemy.id)
            char_fight.save()

        response = _get_response(200, json.dumps(fight, cls=ModelEncoder))

        logger.debug(f'Response: {json.dumps(response)}')

        return response
    except Exception as ex:
        logger.error(f'Could not create fight: {ex}')
        response = _get_response(500, 'Could not create a fight')

        return response
