# enemy/models.py

import os
import json
from datetime import datetime
from uuid import uuid4
from enum import Enum;
from models import EnemyModel, EnemyRaces

if __name__ == "__main__":
    import random

    def calc_dodge(dodge_chance):
        return random.randint(1, 100) * .01 <= dodge_chance

    def calc_block(block_chance):
        return random.randint(1, 100) * .01 <= block_chance

    def calc_critical(crit_chance):
        return random.randint(1, 100) * .01 <= crit_chance

    def calc_missed():
        return random.randint(1, 100) * .01 <= .042

    if not EnemyModel.exists():
        EnemyModel.create_table(read_capacity_units=100, write_capacity_units=100, wait=True)
    
    enemy = EnemyModel.create(EnemyRaces.GNOLL.value, 1)

    print(dict(enemy))

    enemy.update_hp(400)
    enemy.save()

    print(dict(enemy))

    i = 0
    while enemy.status != 'DEAD':
        attack_amt = random.randint(89,148)

        is_missed = calc_missed()
        
        if is_missed:
            attack_amt = 0

        is_critical = calc_critical(.21)

        if is_critical and not is_missed:
            attack_amt = round(attack_amt * 1.5)
        
        is_blocked = False
        is_dodged = False
        
        if enemy.can_block:
            is_blocked = calc_block(enemy.block_pct)

            if is_blocked and not is_missed:
                attack_amt = round(attack_amt * enemy.block_amt)

        if enemy.can_dodge:
            if not is_blocked and not is_missed:
                is_dodged = calc_dodge(enemy.dodge_pct)

                if is_dodged:
                    attack_amt = 0

        enemy.update_hp(attack_amt)
        enemy.save()
        
        print(f'Player X strikes for {attack_amt}: {is_critical}')
        #print(dict(enemy))
        i += 1

    print(f'There were {i} attacks')    

    print(dict(enemy))