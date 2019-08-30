# fights/en_attack.py

import os
import json
import logging
from datetime import datetime
from uuid import uuid4
import random
from py_linq import Enumerable

if 'ENV' in os.environ:
    from models import FightModel, Character, Enemy, AttackModel
    from utils import ModelEncoder
else:
    from fights.models import FightModel, Character, Enemy, AttackModel
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


def _calc_missed():
    return random.randint(1, 100) * .01 <= .05

def _calc_critical(crit_chance):
    return random.randint(1, 100) * .01 <= crit_chance

def _calc_dodge(dodge_chance):
    return random.randint(1, 100) * .01 <= dodge_chance

def _calc_attack(enemy, character):
    attack_amt = random.randint(enemy.min_damage, enemy.max_damage)
    is_missed = False
    is_dodged = False
    is_critical = False

    is_missed = _calc_missed()

    if is_missed:
        attack_amt = 0
    else:
        is_critical = _calc_critical(enemy.crit_chance)

        if is_critical and not is_missed:
            attack_amt = round(attack_amt * 1.5)

        is_dodged = _calc_dodge(.05)

        if is_dodged:
            attack_amt: 0
            is_critical = False
    
    return {
        'attack_amt': attack_amt,
        'is_blocked': False,
        'block_amt': 0,
        'is_missed': False,
        'is_critical': is_critical,
        'is_dodged': is_dodged
    }
        

def handler(event, context):
    """ handle enemy attack, they select from the characters in the fight randomly"""
    try:
        logger.debug(f'Event received: {json.dumps(event)}')

        fight_id = event['pathParameters']['id']
        body = _get_body(event)
        
        fight = FightModel.get(fight_id)

        if not fight.is_active:
            raise Exception('Fight is over cannot attack')

        if fight.enemy.status == "DEAD":
            raise Exception('Enemy cannot attack when dead')

        enemy = fight.enemy
        character = random.choice(fight.characters)

        if character is None:
            raise Exception('Nobody to attack')

        if character.status == 'DEAD':
            raise Exception('Cannot attack a dead character')

        c_attack = _calc_attack(enemy, character)

        attack_amt = c_attack['attack_amt']

        if attack_amt > 0:
            fight.update_character_hp(character.id, attack_amt)

        attack = AttackModel(source_id=enemy.id, source_tp='E',
                         target_id=character.id, target_tp='C',
                         fight_id=fight.id, attack_amt=attack_amt,
                         is_blocked=c_attack['is_blocked'],
                         block_amt=c_attack['block_amt'], is_critical=c_attack['is_critical'],
                         is_missed=c_attack['is_missed'], is_dodged=c_attack['is_dodged'],
                         t_prev_hp=character.prev_hp,
                         t_curr_hp=character.curr_hp, attack_ts=datetime.utcnow())
        
        attack.save()

        response = _get_response(200, json.dumps(attack, cls=ModelEncoder))

        logger.debug(f'Event Response: {json.dumps(response)}')

        return response

    except Exception as ex:
        logger.error(f'Enemy could not attack: {ex}')
        response = _get_response(500, f'Enemy could not attack: {ex}')

        return response