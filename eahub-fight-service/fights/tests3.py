import requests
import json
import time
import multiprocessing

base_url = "https://cnpwf8i2j0.execute-api.us-east-2.amazonaws.com/dev/fights/"


def fight_request(fight_id):
    req_url = f'{base_url}{fight_id}'
    response = requests.get(req_url)

    return response.json()


def cast_attack(fight_id, character):
    fight_res = fight_request(fight_id)
    status = fight_res['enemy']['status']

    while status is not 'DEAD':
        fight_res = fight_request(fight_id)
        status = fight_res['enemy']['status']

        if status is 'DEAD':
            break

        attack_url = f'{base_url}{fight_id}/attack'
        try:
            response = requests.put(attack_url, json.dumps(
                {"character_id": character['id']}))
            if response.status_code != 200:
                raise Exception('broke')

            print(response.json())
            time.sleep(character['attack_speed'] * .001)
        except:
            break


if __name__ == "__main__":

    characters = [
        {"id": "1", "attack_speed": 1600, "crit_chance": 0.17,
            "curr_hp": 1000, "min_damage": 55, "max_damage": 128},
        {"id": "2", "attack_speed": 1500, "crit_chance": 0.27,
            "curr_hp": 1000, "min_damage": 75, "max_damage": 168},
        {"id": "3", "attack_speed": 2700, "crit_chance": 0.29,
            "curr_hp": 1000, "min_damage": 85, "max_damage": 228},
        {"id": "4", "attack_speed": 1800, "crit_chance": 0.25,
            "curr_hp": 1000, "min_damage": 45, "max_damage": 101},
        {"id": "5", "attack_speed": 2100, "crit_chance": 0.24,
            "curr_hp": 1000, "min_damage": 65, "max_damage": 128}
    ]

    fight_req = {
        "enemy": {
            "id": "111",
            "can_block": True,
            "can_dodge": True,
            "block_pct": 0.05,
            "block_amt": 0.51,
            "dodge_pct": 0.07,
            "base_hp": 30000
        },
        "characters": characters
    }

    response = requests.post(base_url, data=json.dumps(fight_req))

    fight_id = response.json()['id']
    # Do attacks
    party = []
    for character in characters:
        p = multiprocessing.Process(
            target=cast_attack, args=(fight_id, character,))
        party.append(p)
        p.start()
    ####
