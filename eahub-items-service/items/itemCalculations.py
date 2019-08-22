from math import ceil

quality_modifiers = {
    1: 1,
    2: 1.15,
    3: 1.25
}

def calc_attack_power(level, quality):
    power = (level * 1.19 + 8.1) * quality_modifiers[quality]
    return round(power, 0)

def calc_crit_chance(level, quality):
    crit = (((level + 10) * 1.85 * 44) / 44) * quality_modifiers[quality]
    crit = crit / 44
    return round(crit * 0.01, 6)

def calc_stamina(level, quality):
    stamina = (level * 1.35 + 10) * quality_modifiers[quality]
    return round(ceil(stamina), 0)
    
if __name__ == "__main__":
    
    for i in range(1, 61, 1):
        for x in range(1, 4, 1):
            print(f'L: {i} Q: {x} S: {calc_stamina(i, x)} C: {calc_crit_chance(i, x)} A: {calc_attack_power(i, x)}')
    
