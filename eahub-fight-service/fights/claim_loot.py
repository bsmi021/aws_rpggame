import os
import json
import logging
from datetime import datetime
from uuid import uuid4
from py_linq import Enumerable

if 'ENV' in os.environ:
    from models import FightModel, Character, Enemy, CharacterFightModel
    from utils import ModelEncoder
else:
    from fights.models import FightModel, Character, Enemy, CharacterFightModel
    from fights.utils import ModelEncoder

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)


def handler(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')

    try:
        data = json.loads(event.get('body'))

        fight_id = event['pathParameters']['id']

        fight = FightModel.get(fight_id)

        if fight is None:
            raise Exception(f'Could not find a fight for {fight_id}')

        char_id = data['char_id']
        
        character = Enumerable(fight.characters).first_or_default(lambda c: c.id == char_id)

        if character is None:
            raise Exception(f'No character found for {char_id} in fight {fight_id}')

        character.loot_claimed = True

        fight.save()

        response = {
            'statusCode': 200,
            'body': json.dumps(fight, cls=ModelEncoder),
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }

        logger.debug(f'Response: {json.dumps(response)}')

        return response

    except Exception as e:
        if hasattr(e, 'message'):
            logger.error(f'Error: {e.message}')
        else:
            logger.error(e)

        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Could not create loot.'
            })
        }

# if __name__ == "__main__":
#     from uuid import uuid4

#     if not FightModel.exists():
#         FightModel.create_table(read_capacity_units=5,
#                                 write_capacity_units=100,
#                                 wait=True)

#     from create import create as create_fight
#     from create_loot import handler as create_loot

#     characters = [
#             { "id":"1", "attack_speed":1600, "crit_chance": 0.17, "curr_hp": 1000, "min_damage":55, "max_damage": 128 },
#             { "id":"2", "attack_speed":1500, "crit_chance": 0.27, "curr_hp": 1000, "min_damage":75, "max_damage": 168 },
#             { "id":"3", "attack_speed":2700, "crit_chance": 0.29, "curr_hp": 1000, "min_damage":85, "max_damage": 228 },
#             { "id":"4", "attack_speed":1800, "crit_chance": 0.25, "curr_hp": 1000, "min_damage":45, "max_damage": 101 },
#             { "id":"5", "attack_speed":2100, "crit_chance": 0.24, "curr_hp": 1000, "min_damage":65, "max_damage": 128 }
#         ]

#     fight_req = {
#         "enemy": {
#             "id": "111",
#             "can_block": True,
#             "can_dodge": True,
#             "block_pct": 0.05,
#             "block_amt": 0.51,
#             "dodge_pct": 0.07,
#             "hit_points": 3000
#         },
#         "characters": characters
#     }

#     fight_req = {
#         'body': json.dumps(fight_req)
#     }

#     fight_response = create_fight(fight_req, None)

#     # print(fight_response)

#     fight_data = json.loads(fight_response.get('body'))

#     fight_id = fight_data['id']

#     c_loot = []
#     for c in characters:
#         loot_i = {
#             'char_id': c.get('id'),
#             'item_id': str(uuid4())
#         }

#         c_loot.append(loot_i)
    
#     cr_loot_request = {
#         'pathParameters': {
#             'id': fight_id
#         },
#         'body': json.dumps(c_loot)
#     }

#     print(cr_loot_request)
#     response = create_loot(cr_loot_request, None)

#     #print(response)
    
#     for char in characters:
#         claim_r = {
#             'pathParameters': {
#                 'id': fight_id
#                 },
#              'body': json.dumps({ 'char_id': char.get('id')})
            
#         }

#         print(claim_r)

#         response = handler(claim_r, None)

#         print(response)
    