from math import ceil

quality_modifiers = {
    1: 1,
    2: 1.15,
    3: 1.25
}

slot_mod_values = {
    1: 1,
    2: 0.75,
    3: 0.5625,
    4: 0.421875
}

slot_modifiers = {
    1: slot_mod_values[1], #'HEAD',
    2: slot_mod_values[1], #'CHEST',
    3: slot_mod_values[2],#'SHOULDERS',
    4: slot_mod_values[1],#'LEGS',
    5: slot_mod_values[3],#'WRIST',
    6: slot_mod_values[2],#'HANDS',
    7: slot_mod_values[2],#'FEET',
    8: slot_mod_values[3],#'BACK',
    9: slot_mod_values[3],#'RING_1',
    10: slot_mod_values[3],#'RING_2',
    11: slot_mod_values[3],#'NECK',
    12: slot_mod_values[4],#'MAIN_HAND',
    13: slot_mod_values[4],#'OFF_HAND',
    14: slot_mod_values[1],#'BOTH_HAND',
    15: slot_mod_values[2],#'WAIST'
}


def calc_attack_power(level, quality, slot):
    power = ((level + 5) * 1.19 + 8.1) * quality_modifiers[quality]
    return round(power * slot_modifiers[slot], 0)

def calc_crit_chance(level, quality, slot):
    crit = ((((level + 5) + 10) * 1.85 * 44) / 44) * quality_modifiers[quality]
    crit = crit / 44
    return round((crit * slot_modifiers[slot]) * 0.01, 6)

def calc_stamina(level, quality, slot):
    stamina = ((level + 5) * 1.35 + 10) * quality_modifiers[quality]
    return round(ceil(stamina * slot_modifiers[slot]), 0)
    
if __name__ == "__main__":
    
    for i in range(1, 61, 1):
        for x in range(1, 4, 1):
            print(f'L: {i} Q: {x} S: {calc_stamina(i, x, 10)} C: {calc_crit_chance(i, x, 10)} A: {calc_attack_power(i, x, 10)}')
    
