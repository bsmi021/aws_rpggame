import json
import time
import requests
from py_linq import Enumerable

items_url = 'https://jrc3odl45h.execute-api.us-east-2.amazonaws.com/dev/items'
chars_url = 'https://a2vfcn11yh.execute-api.us-east-2.amazonaws.com/dev/characters'
add_item_url = f'{chars_url}/'
equip_item_url = f'{chars_url}/'

if __name__ == "__main__":

    items_response = requests.get(f'{items_url}?level=1')

    items = json.loads(items_response.content)

    items = items['items']

#    for item in items:
#        print(item)

    char_response = requests.get(chars_url)

    chars = json.loads(char_response.content)

    chars = chars['characters']

    x_items = Enumerable(items)
    for char in chars:
        char_id = char['id']
        if len(char['inventory']) == 0:
            print('Adding items to: ' + char['name'])
            p_class = char['player_class']
            f_items = Enumerable([])

            if p_class == 1:
                f_items = x_items.where(lambda x: x['is_warrior'] == True)
            elif p_class == 2:
                f_items = x_items.where(lambda x: x['is_archer'] == True)
            elif p_class == 3:
                f_items = x_items.where(lambda x: x['is_sorcerer'] == True)
            elif p_class == 4:
                f_items = x_items.where(lambda x: x['is_rogue'] == True)
            else:
                continue

            
            for item in f_items:
                
                #  or x['is_rogue'] == (
                # p_class == 4) or x['is_sorcerer'] == (p_class == 3) or x['is_archer'] == (p_class == 2))
                add_request =  json.dumps({ "item_id": item['id']})

                add_resp = requests.put(f'{chars_url}/{char["id"]}/add_item', data=add_request)

                if not add_resp.status_code == 200:
                    print(f'Error: {char_id}: Request: {add_resp.content}')


        print(char_id)
        p_char_response = requests.get(f'{chars_url}/{char_id}')

        char_data = json.loads(p_char_response.content)
        print("Equipping items for " + char_data['name'])

        char_inventory = char_data['inventory']

        for inv_item in char_inventory:
            equip_request =  json.dumps({ "inv_id": inv_item['inv_id']})

            equip_response = requests.put(f'{chars_url}/{char_id}/equip_item', equip_request)

            if not equip_response.status_code == 200:
                print(f'Equip Error: {char_id}: Request: {json.dumps(equip_response)}')

