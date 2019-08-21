# fights/prototype.py
# prototype for a fight with a single character

import os
import json
import logging
import random
from boto3 import client

log_level = os.environ.get('LOG_LEVEL', 'INFO')
logging.root.setLevel(logging.getLevelName(log_level))
logger = logging.getLogger(__name__)

region = os.environ['REGION']
char_lambda = os.environ['GET_CHAR_SERVICE']
enemy_lambda = os.environ['CREATE_ENEMY_SERVICE']
fight_lambda = os.environ['CREATE_FIGHT_SERVICE']

lambda_client = client('lambda', region_name=region)

def start(event, context):
    logger.debug(f'Event received: {json.dumps(event)}')
    #char_id = event['pathParameters']['id']
    data = json.loads(event['body'])

    # create the request to get the character
    char_request = {
        'pathParameters': {
            'id': data['id']
        }
    }

    # get the character data (needed to start a fight as current state is stored w/ fight)
    character_response = lambda_client.invoke(FunctionName=char_lambda,
                                              InvocationType="RequestResponse",
                                              Payload=json.dumps(char_request))

    # need to read and load twice, char service was written for API Gateway
    char_data = json.loads(character_response.get('Payload').read())
    char_data = json.loads(char_data['body'])

    # get the character's level to pass as req param to enemy service
    char_level = char_data['level']
    en_race = random.choice([1, 2, 3, 4]) # hard coded to an orc for now

    # request object for the create enemy service
    enemy_request = {
        'body': json.dumps({
            'level': char_level,
            'race': en_race
        })
    }

    # create the enemy by invoking the create enemy lambda
    enemy_response = lambda_client.invoke(FunctionName=enemy_lambda,
                                          InvocationType="RequestResponse",
                                          Payload=json.dumps(enemy_request))
    
    # need to read and load twice, since enemy service is meant for API Gateway
    enemy_data = json.loads(enemy_response.get('Payload').read())
    enemy_data = json.loads(enemy_data['body'])

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
    fight_response = lambda_client.invoke(FunctionName=fight_lambda,
                                          InvocationType="RequestResponse",
                                          Payload=json.dumps(fight_request))
    
    # get the payload from the fight
    fight_data = json.loads(fight_response.get('Payload').read())

    # build the response object
    response = {
        'statusCode': 200,
        'body': fight_data['body'],
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }

    # return the fight response
    return response

