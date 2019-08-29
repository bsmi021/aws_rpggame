# fights/ws_start_fight.py
# logic for opening a connection and starting a fight

import os
import json
import logging
import random
import boto3
from py_linq import Enumerable

if 'ENV' in os.environ:
    from models import FightConnectionModel
    import experienceCalcs
else:
    from fights.models import FightConnectionModel
    import fights.experienceCalcs as experienceCalcs

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
char_lambda = os.environ['GET_CHAR_SERVICE']
create_enemy_lambda = os.environ['CREATE_ENEMY_SERVICE']
start_fight_lambda = os.environ['CREATE_FIGHT_SERVICE']
attack_lambda = os.environ['ATTACK_SERVICE']
get_fight_lambda = os.environ['GET_FIGHT_SERVICE']
get_enemy_lambda = os.environ['GET_ENEMY_SERVICE']
list_items_lambda = os.environ['LIST_ITEM_SERVICE']
get_item_lambda = os.environ['GET_ITEM_SERVICE']
add_xp_lambda = os.environ['ADD_XP_SERVICE']
create_loot_lambda = os.environ['CREATE_LOOT_SERVICE']
char_add_item_lambda = os.environ['CHAR_ADD_ITEM_SERVICE']
claim_loot_lambda = os.environ['CLAIM_LOOT_SERVICE']

lambda_client = boto3.client('lambda', region_name=region)


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


def _get_connection_id(event):
    return event['requestContext'].get('connectionId')


def _send_to_connection(connection_id, data, event):
    """ Sends a payload of data to the specified connection """
    gatewayapi = boto3.client("apigatewaymanagementapi",
                              endpoint_url="https://" + event["requestContext"]["domainName"] +
                              "/" + event["requestContext"]["stage"])
    return gatewayapi.post_to_connection(ConnectionId=connection_id,
                                         Data=json.dumps(data).encode('utf-8'))


def _get_fight(fight_id):
    fight_request = {
        "pathParameters": {
            "id": fight_id
        }
    }

    fight_response = lambda_client.invoke(FunctionName=get_fight_lambda,
                                          InvocationType="RequestResponse",
                                          Payload=json.dumps(fight_request))

    fight_data = json.loads(fight_response.get('Payload').read())
    fight_data = _get_body(fight_data)

    return fight_data


def _list_items(player_class, level):
    items_request = {
        'queryStringParameters': {
            'player_class': player_class,
            'level': level
        }
    }

    logger.info(json.dumps(items_request))
    item_response = lambda_client.invoke(FunctionName=list_items_lambda,
                                         InvocationType="RequestResponse",
                                         Payload=json.dumps(items_request))

    items_data = json.loads(item_response.get('Payload').read())

    logger.info(json.dumps(items_data))
    items_data = _get_body(items_data)

    return items_data


def _get_enemy(enemy_id):
    logger.info(f'Enemy requested for id:{enemy_id}')
    enemy_request = {
        'pathParameters': {
            'id': enemy_id
        }
    }

    enemy_response = lambda_client.invoke(FunctionName=get_enemy_lambda,
                                          InvocationType="RequestResponse",
                                          Payload=json.dumps(enemy_request))

    enemy_data = json.loads(enemy_response.get('Payload').read())
    enemy_data = _get_body(enemy_data)
    return enemy_data


def _get_character(char_id):
    char_request = {
        'pathParameters': {
            'id': char_id
        }
    }

    # get the character data (needed to start a fight as current state is stored w/ fight)
    character_response = lambda_client.invoke(FunctionName=char_lambda,
                                              InvocationType="RequestResponse",
                                              Payload=json.dumps(char_request))

    # need to read and load twice, char service was written for API Gateway
    char_data = json.loads(character_response.get('Payload').read())
    char_data = _get_body(char_data)

    return char_data


def _create_loot(fight_id, char_id, item_id):
    request = {
        'pathParameters': {
            'id': fight_id
        },
        'body': json.dumps([{
            'char_id': char_id,
            'item_id': item_id
        }])
    }
    # the body is an array to support future expansion for multiple characters

    response = lambda_client.invoke(FunctionName=create_loot_lambda,
                                    InvocationType='Event',
                                    Payload=json.dumps(request))

    if response['StatusCode'] >= 400:
        logger.error(f'Could not create loot: {json.dumps(request)}')


def _add_xp_to_char(char_id, xp_earned):
    xp_request = {
        'pathParameters': {
            'id': char_id
        },
        'body': json.dumps({
            'xp_earned': xp_earned
        })
    }

    # update the xp for the character
    xp_response = lambda_client.invoke(FunctionName=add_xp_lambda,
                                       InvocationType="Event",
                                       Payload=json.dumps(xp_request))

    if xp_response['StatusCode'] >= 400:
        logger.error(f'Could not add XP: {json.dumps(xp_request)}')


def _char_add_item(char_id, item):
    add_request = {
        'pathParameters': {
            'id': char_id
        },
        'body': json.dumps({
            'id': item['id'],
            'slot': item['slot'],
            'slot_name': item['slot_name'],
            'damage': item['damage'],
            'stamina': item['stamina'],
            'crit_chance': item['crit_chance']
        })
    }

    add_response = lambda_client.invoke(FunctionName=char_add_item_lambda,
                                        InvocationType='Event',
                                        Payload=json.dumps(add_request))

    return add_response['StatusCode']


def _get_item(item_id):
    request = {
        'pathParameters': {
            'id': item_id
        }
    }

    item_response = lambda_client.invoke(FunctionName=get_item_lambda,
                                         InvocationType='RequestResponse',
                                         Payload=json.dumps(request))

    item_data = json.loads(item_response.get('Payload').read())
    item_data = _get_body(item_data)

    return item_data


def _mark_loot_claimed(fight_id, char_id):
    request = {
        'pathParameters': {
            'id': fight_id
        },
        'body': json.dumps({
            'char_id': char_id
        })
    }

    response = lambda_client.invoke(FunctionName=claim_loot_lambda,
                                    InvocationType='Event',
                                    Payload=json.dumps(request))

    return response['StatusCode']


def connection_manager(event, context):
    """ Handles connecting and disconnecting from the socket """

    connection_id = event['requestContext'].get('connectionId')
    event_type = event['requestContext'].get('eventType')

    if event_type == 'CONNECT':
        logger.info('Connection requested')

        connection = FightConnectionModel(connection_id=connection_id)
        connection.save()
        return _get_response(200, 'Connection success')
    elif event_type == 'DISCONNECT':
        logger.info(('Disconnect requested'))
        FightConnectionModel.get(connection_id).delete()

        return _get_response(200, 'Disconnect success ')
    else:
        logger.error(
            'Connection manager recieved something it could not handle')
        return _get_response(500, "Unrecognized eventType")


def start_fight(event, context):
    """ When a start fight request is sent to the socket create the fight return details """
    logger.info("Fight requested")
    connection_id = _get_connection_id(event)

    body = _get_body(event)
    if 'char_id' not in body:
        logger.error(f'Failed: char_id not in message')
        return _get_response(400, f'Char_id not in message')

    char_id = body.get('char_id')

    char_data = _get_character(char_id)

    char_level = char_data.get('level')

    # request an enemy
    en_race = random.choice([1, 2, 4, 3])

    en_request = {
        'body': json.dumps({
            'level': char_level,
            'race': en_race
        })
    }

    en_response = lambda_client.invoke(FunctionName=create_enemy_lambda,
                                       InvocationType="RequestResponse",
                                       Payload=json.dumps(en_request))

    # need to read and load twice, since enemy service is meant for API Gateway
    enemy_data = json.loads(en_response.get('Payload').read())
    enemy_data = _get_body(enemy_data)

    # build the fight request
    fight_request = {
        'body': json.dumps({
            'characters': [
                {
                    'id': char_data['id'],
                    'attack_speed': char_data['attack_speed'],
                    'curr_hp': char_data['hit_points'],
                    'prev_hp': char_data['hit_points'],
                    'crit_chance': char_data['crit_chance'],
                    'min_damage': char_data['min_damage'],
                    'max_damage': char_data['max_damage']
                }
            ],
            'enemy': enemy_data
        })
    }

    # create the fight by invoking the create fight lambda
    fight_response = lambda_client.invoke(FunctionName=start_fight_lambda,
                                          InvocationType="RequestResponse",
                                          Payload=json.dumps(fight_request))

    # get the payload from the fight
    fight_data = json.loads(fight_response.get('Payload').read())
    fight_data = _get_body(fight_data)

    logger.info(json.dumps(fight_data))

    fight = _get_fight(fight_data['id'])

    data = _get_response(200, fight_data)

    c_data = {
        'message': 'FIGHT_STARTED',
        'fight': fight,
        'character': char_data,
        'enemy': enemy_data
    }

    _send_to_connection(connection_id, c_data, event)

    return _get_response(200, "Fight sent to requestor")

def on_player_win(fight, event):
    if fight['is_active']:
        logger.info('Fight is still active cannot create XP')
        return

    connection_id = _get_connection_id(event)

    # need to get the enemy to calc xp
    enemy = _get_enemy(fight['enemy']['id'])

    if 'level' not in enemy:
        raise Exception('Missing enemy data')

    enemy_level = enemy['level']

    for f_char in fight['characters']:
        char = _get_character(f_char['id'])
        curr_level = char['level']

        xp_earned = experienceCalcs.xp_earned(char['level'], enemy_level)

        c_data = {
            'message': 'XP_EARNED',
            'xp_earned': xp_earned,
            'prev_level': curr_level
        }

        # send out to add xp to the character
        _add_xp_to_char(char['id'], xp_earned)

        char = _get_character(f_char['id'])
        
        c_data['curr_level'] = char['level']

        _send_to_connection(connection_id, c_data, event)

        loot_awarded = random.randint(1, 100) * .01 <= .42

        if char['level'] == 1:
            c_data = {
                'message': 'NO_LOOT'
            }

            _send_to_connection(connection_id, c_data, event)
            continue

        items = _list_items(char['player_class'], char['level'])

        logger.info(json.dumps(items))

        item = random.choice(items['items'])

        c_data = {
            'message': 'LOOT',
            'loot_item': item
        }

        _create_loot(fight['id'], char['id'], item['id'])
        _send_to_connection(connection_id, c_data, event)


def claim_loot(event, context):
    """ Allows a character to claim the loot from their fight """
    logger.info("Claim requested")
    connection_id = _get_connection_id(event)

    try:
        body = _get_body(event)

        for attribute in ['char_id', 'fight_id']:
            if attribute not in body:
                logger.debug(f'failed: {attribute} not in message')
                return _get_response(400, f'{attribute} not in message')

        char_id = body['char_id']
        fight_id = body['fight_id']

        fight = _get_fight(fight_id)

        if 'id' not in fight:
            raise Exception('Fight is missing')

        characters = Enumerable(fight['characters'])

        # check for the character in the fight
        char = characters.first_or_default(lambda c: c['id'] == char_id)

        if char is None:
            raise Exception('The character specified was not in the fight')

        loot_item_id = char.get('loot_item_id', None)

        if loot_item_id is None:
            raise Exception('There was no loot for the character')

        # get the item
        item = _get_item(loot_item_id)

        add_result = _char_add_item(char_id, item)

        if add_result >= 400:
            raise Exception('Could not add the loot to the character')

        mark_result = _mark_loot_claimed(fight_id, char_id)

        if mark_result >= 400:
            raise Exception('Could not mark the loot claimed')

        c_data = {
            'message': 'LOOT_CLAIMED',
            'fight_id': fight_id,
            'char_id': char_id,
            'item_id': item['id']
        }

        _send_to_connection(connection_id, c_data, event)

        return _get_response(200, 'Loot claimed')
    except Exception as ex:
        logger.error(ex)
        c_data = {
            'message': 'LOOT_CLAIMED_ERROR'
        }
        _send_to_connection(connection_id, c_data, event)
        return _get_response(500, ex)


def player_attack(event, context):
    """ Casts a player attack on the enemy for the specified fight """
    logger.info("Attack requested")
    connection_id = _get_connection_id(event)

    body = _get_body(event)

    for attribute in ['char_id', 'fight_id']:
        if attribute not in body:
            logger.debug(f'failed: {attribute} not in message')
            return _get_response(400, f'{attribute} not in message')

    char_id = body.get('char_id')
    fight_id = body.get('fight_id')

    # get the fight, make sure it's still active if not send message
    fight_data = _get_fight(fight_id)

    if not fight_data['is_active']:
        data = {
            'message': 'FIGHT_ENDED',
            'fight': fight_data
        }

        _send_to_connection(connection_id, data, event)

        return _get_response(200, 'No attack')

    # create a request for an attack
    attack_request = {
        'pathParameters': {
            'id': fight_id
        },
        'body': json.dumps({
            'character_id': char_id
        })
    }

    attack_response = lambda_client.invoke(FunctionName=attack_lambda,
                                           InvocationType='RequestResponse',
                                           Payload=json.dumps(attack_request))

    attack_data = json.loads(attack_response.get('Payload').read())
    attack_data = _get_body(attack_data)

    fight_data = _get_fight(fight_id)

    c_data = {
        "message": 'ATTACK_SUCCESS',
        "fight": fight_data,
        "attack": attack_data
    }

    if fight_data['enemy']['status'] != 'ALIVE':
        logger.info('Sending to xp event')
        on_player_win(fight_data, event)
        logger.info('Finished xp event')

    response = _get_response(200, "Attack action completed")

    _send_to_connection(connection_id, c_data, event)

    if not fight_data['is_active']:
        c_data = {
            'message': 'FIGHT_ENDED',
            'fight': fight_data
        }

    return response
