from datetime import datetime
from models import FightModel, Enemy, Character, AttackModel
from utils import ModelEncoder
import json
import multiprocessing
import os
from uuid import uuid4
import random
import time


def calc_dodge(dodge_chance):
    return random.randint(1, 100) * .01 <= dodge_chance


def calc_block(block_chance):
    return random.randint(1, 100) * .01 <= block_chance


def calc_critical(crit_chance):
    return random.randint(1, 100) * .01 <= crit_chance


def calc_missed():
    return random.randint(1, 100) * .01 <= .042


def calc_attack(player, fight):
    attack_amt = random.randint(player.min_damage, player.max_damage)
    is_missed = False
    is_blocked = False
    is_dodged = False
    is_critical = False
    blocked_amt = 0

    is_missed = calc_missed()

    if is_missed:
        attack_amt = 0

    is_critical = calc_critical(.21)

    if is_critical and not is_missed:
        attack_amt = round(attack_amt * 2.5)

    if fight.enemy.can_block:
        is_blocked = calc_block(fight.enemy.block_pct)

        if is_blocked and not is_missed:
            blocked = round(attack_amt * fight.enemy.block_amt)
            blocked_amt = attack_amt - blocked
            attack_amt = blocked

    if fight.enemy.can_dodge:
        if not is_blocked and not is_missed:
            is_dodged = calc_dodge(fight.enemy.dodge_pct)

            if is_dodged:
                attack_amt = 0

    return {'attack_amt': attack_amt,
            'is_blocked': is_blocked,
            'is_dodged': is_dodged,
            'is_missed': is_missed,
            'is_critical': is_critical,
            'block_amt': blocked_amt}


def sim_player(player, fight):
    while fight.enemy.status == 'ALIVE':
        time.sleep((player.attack_speed * .001))

        response = calc_attack(player, fight)

        attack_amt = response['attack_amt']

        if attack_amt > 0:
            fight.get(fight.id)
            fight.update_enemy_hp(attack_amt)

        attack = AttackModel(source_id=player.id, source_tp='C', target_id=fight.enemy.id, target_tp='E',
                             fight_id=fight.id, attack_amt=attack_amt, is_blocked=response[
                                 'is_blocked'],
                             block_amt=response['block_amt'], is_critical=response['is_critical'],
                             is_missed=response['is_missed'], is_dodged=response['is_dodged'], t_prev_hp=fight.enemy.prev_hp,
                             t_curr_hp=fight.enemy.curr_hp, attack_ts=datetime.utcnow())
        attack.save()

        # fight.get(fight.id)
        # print(dict(fight))
        print(
            f'Player {player.id} attacks for {attack_amt}. Waiting {(player.attack_speed * .001)}')


def get_fight(id):
    fight = FightModel.get(id)
    while fight.enemy.status == 'ALIVE':
        # time.sleep(1)
        fight = FightModel.get(id)
        print(
            f'Prev HP: {fight.enemy.prev_hp} | Current HP: {fight.enemy.curr_hp}.')


if __name__ == "__main__":

    os.environ['ENV'] = '1'


    if not FightModel.exists():
        FightModel.create_table(read_capacity_units=5,
                                write_capacity_units=100, wait=True)

    if not AttackModel.exists():
        AttackModel.create_table(read_capacity_units=5,
                                 write_capacity_units=5,
                                 wait=True)

    for result in AttackModel.scan():
        print(json.dumps(result, cls=ModelEncoder))
    # print(AttackModel.scan())

    fight = FightModel(id=str(uuid4()))

    enemy = Enemy(id="1", can_block=True, can_dodge=True, block_pct=0.05,
                  block_amt=.54, dodge_pct=0.07, base_hp=2500, curr_hp=2500, prev_hp=2500)

    char1 = Character(id="1", attack_speed=1600, crit_chance=0.17,
                      curr_hp=1000, prev_hp=1500, min_damage=55, max_damage=128)
    char2 = Character(id="2", attack_speed=2700, crit_chance=0.27,
                      curr_hp=1250, prev_hp=3000, min_damage=65, max_damage=155)
    char3 = Character(id="3", attack_speed=1800, crit_chance=0.19,
                      curr_hp=1300, prev_hp=1800, min_damage=51, max_damage=132)
    char4 = Character(id="4", attack_speed=2100, crit_chance=0.21,
                      curr_hp=1199, prev_hp=3500, min_damage=35, max_damage=149)

    fight.enemy = enemy
    fight.characters = [char1, char2, char3, char4]

    fight.save()

    print(dict(fight))

    party = []
    for player in fight.characters:
        p = multiprocessing.Process(target=sim_player, args=(player, fight, ))
        party.append(p)

    px = multiprocessing.Process(target=get_fight, args=(fight.id, ))
    party.append(px)
    for p in party:
        p.start()
