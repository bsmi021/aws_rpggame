# fights/attack.py

import os
import json
import logging
from uuid import uuid4
from datetime import datetime
from py_linq import Enumerable
import random

if 'ENV' in os.environ:
    from models import FightModel, AttackModel
    from utils import ModelEncoder
else:
    from fights.models import FightModel, AttackModel
    from fights.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def _calc_dodge(dodge_chance):
    return random.randint(1, 100) * .01 <= dodge_chance


def _calc_block(block_chance):
    return random.randint(1, 100) * .01 <= block_chance


def _calc_critical(crit_chance):
    return random.randint(1, 100) * .01 <= crit_chance


def _calc_missed():
    return random.randint(1, 100) * .01 <= .042


def calc_attack(player, fight):
    attack_amt = random.randint(player.min_damage, player.max_damage)
    is_missed = False
    is_blocked = False
    is_dodged = False
    is_critical = False
    blocked_amt = 0

    is_missed = _calc_missed()

    if is_missed:
        attack_amt = 0
    else:
        is_critical = _calc_critical(.21)

        if is_critical and not is_missed:
            attack_amt = round(attack_amt * 2.5)

        if fight.enemy.can_block:
            is_blocked = _calc_block(fight.enemy.block_pct)

            if is_blocked:
                blocked = round(attack_amt * fight.enemy.block_amt)
                blocked_amt = attack_amt - blocked
                attack_amt = blocked

        if fight.enemy.can_dodge and not is_blocked:
            is_dodged = _calc_dodge(fight.enemy.dodge_pct)

            if is_dodged:
                attack_amt = 0

    return {'attack_amt': attack_amt,
            'is_blocked': is_blocked,
            'is_dodged': is_dodged,
            'is_missed': is_missed,
            'is_critical': is_critical,
            'block_amt': blocked_amt}


def attack(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    fight_id = event['pathParameters']['id']
    data = json.loads(event['body'])
    character_id = data['character_id']

    fight = FightModel.get(fight_id)

    if fight.enemy.status == "DEAD":
        raise Exception('Cannot attack a dead target')

    character = Enumerable(fight.characters).first_or_default(
        lambda x: x.id == character_id)

    if character is None:
        raise Exception('Character not in part')

    c_attack = calc_attack(character, fight)
    attack_amt = c_attack['attack_amt']

    if attack_amt > 0:
        fight.update_enemy_hp(attack_amt)

    attack = AttackModel(source_id=character.id, source_tp='C',
                         target_id=fight.enemy.id, target_tp='E',
                         fight_id=fight.id, attack_amt=attack_amt,
                         is_blocked=c_attack['is_blocked'],
                         block_amt=c_attack['block_amt'], is_critical=c_attack['is_critical'],
                         is_missed=c_attack['is_missed'], is_dodged=c_attack['is_dodged'],
                         t_prev_hp=fight.enemy.prev_hp,
                         t_curr_hp=fight.enemy.curr_hp, attack_ts=datetime.utcnow())
    attack.save()

    response = {
        'statusCode': 200,
        'body': json.dumps(attack, cls=ModelEncoder),
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    logger.debug(f'Response: {json.dumps(response)}')

    return response
