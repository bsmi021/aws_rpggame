import requests
import json
import time

url = 'https://jrc3odl45h.execute-api.us-east-2.amazonaws.com/dev/items'

if __name__ == "__main__":

    classes = [
        {'class_id': 1, 'name': 'Warrior', 'can_use_2h': True,
            'can_dual_wield': True, 'default_2h': True, 'weapon_name': 'Battle Axe'},
        {'class_id': 2, 'name': 'Archer', 'can_use_2h': False,
            'can_dual_wield': False, 'default_2h': False, 'weapon_name': 'Longbow'},
        {'class_id': 3, 'name': 'Sorcerer', 'can_use_2h': True,
            'can_dual_wield': False, 'default_2h': True, 'weapon_name': 'Staff'},
        {'class_id': 4, 'name': 'Rogue', 'can_use_2h': False,
            'can_dual_wield': True, 'default_2h': True, 'weapon_name': 'Dagger'},
    ]

    slots = {
        1: 'Helmet',
        2: 'CHEST piece',
        3: 'SHOULDER pads',
        4: 'Grieves',
        5: 'Bracers',
        6: 'Gloves',
        7: 'Sabatons',
        8: 'Cape',
        9: 'Ring 1',
        10: 'RING 2',
        11: 'NECKlace',
        12: 'MAIN HAND',
        13: 'off hand',
        14: 'Two handed',
        15: 'Belt'
    }

    for i in range(1, 61, 1):
        for char_class in classes:
            for slot in slots:

                # {slots[slot].title()}'
                name = f'Level {i} {char_class.get("name")}'
                if slot in [12, 13, 14]:
                    name = f'{name} {char_class.get("weapon_name")}'
                else:
                    name = f'{name} {slots[slot]}'

                if (char_class.get('class_id') == 4 and slot in [14]) or (char_class.get('class_id') in [1, 2, 3] and slot in [12, 13]):
                    continue

                class_id = char_class.get('class_id')

                body =  json.dumps({
                    'name': name,
                    'description': (f'Generic {slots[slot].title()}.'),
                    'level': i,
                    'slot': slot,
                    'is_warrior': class_id == 1,
                    'is_rogue': class_id == 4,
                    'is_archer': class_id == 2,
                    'is_sorcerer': class_id == 3
                })
                

                #print(body)
                response = requests.post(url=url, data=body)
                
                print(response)
                time.sleep(.25)

