from create import create
import multiprocessing
import os
import json
from attack import attack
from models import AttackModel, FightModel
from get import get
import time


def cast_attack(fight_id, character):

    fight_req = {
        "pathParameters": {
            "id": fight_id
        }
    }

    fight_res = get(fight_req, None)
    data = json.loads(fight_res['body'])
    #print(data)
    while data['enemy']['status'] is not 'DEAD':
        request = {
            "pathParameters": {
                "id": fight_id
            },
            "body": json.dumps({ "character_id": character['id'] })
        }

        response = attack(request, None)

        print (json.dumps(response['body']))
        time.sleep(character['attack_speed'] * .001)

if __name__ == "__main__":


    os.environ['ENV'] = '1'

    # create the tables in dynamodb-local if they don't exist
    if not FightModel.exists():
        FightModel.create_table(read_capacity_units=5,
                                write_capacity_units=100, wait=True)

    if not AttackModel.exists():
        AttackModel.create_table(read_capacity_units=5,
                                 write_capacity_units=5,
                                 wait=True)

    # create a fight

    characters = [
            { "id":"1", "attack_speed":1600, "crit_chance": 0.17, "curr_hp": 1000, "min_damage":55, "max_damage": 128 },
            { "id":"2", "attack_speed":1500, "crit_chance": 0.27, "curr_hp": 1000, "min_damage":75, "max_damage": 168 },
            { "id":"3", "attack_speed":2700, "crit_chance": 0.29, "curr_hp": 1000, "min_damage":85, "max_damage": 228 },
            { "id":"4", "attack_speed":1800, "crit_chance": 0.25, "curr_hp": 1000, "min_damage":45, "max_damage": 101 },
            { "id":"5", "attack_speed":2100, "crit_chance": 0.24, "curr_hp": 1000, "min_damage":65, "max_damage": 128 }
        ]

    fight_req = {
        "enemy": {
            "id": "111",
            "can_block": True,
            "can_dodge": True,
            "block_pct": 0.05,
            "block_amt": 0.51,
            "dodge_pct": 0.07,
            "base_hp": 3000
        },
        "characters": characters
    }

    req = {
        'body': json.dumps(fight_req)
    }
    print (json.dumps(fight_req))
    
    response = create(req, None)

    print(response)
    data = json.loads(response['body'])
    fight_id = data['id']

    ### 

    # Do attacks
    party = []
    for character in characters:
        p = multiprocessing.Process(target=cast_attack, args=(fight_id, character,))
        party.append(p)
        p.start()
    ####
