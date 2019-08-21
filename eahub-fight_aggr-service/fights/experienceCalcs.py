
def reduction_factor(char_lvl):
    # a difficulty reduction factor is applied by increased level
    if (char_lvl < 10):
        return 1
    if (11 <= char_lvl <= 27):
        return (1-(char_lvl-10)/100)
    if (28 <= char_lvl <= 59):
        return .82
    else:
        return 1


def difficulty_factor(char_lvl):
    # An extra difficulty factor is applied at level 30 and increased by level
    if (char_lvl <= 28):
        return 0
    if (char_lvl == 29):
        return 1
    if (char_lvl == 30):
        return 3
    if (char_lvl == 31):
        return 6
    if (32 <= char_lvl <= 59):
        return 5 * (char_lvl - 30)
    else:
        return 0


def max_xp_earned(char_lvl):
    # assume same level between enemy and player
    return 45 + (5*char_lvl)


def xp_earned(char_lvl, en_lvl):
    if (char_lvl - 4 > en_lvl):
        return 0
    return 45 + (5*(char_lvl - (0 if char_lvl == en_lvl else char_lvl-en_lvl)))


def xp_required_to_level(char_lvl):
    return int(((8 * char_lvl) + difficulty_factor(char_lvl)) * max_xp_earned(char_lvl) * reduction_factor(char_lvl))


if __name__ == "__main__":

    for i in range(1, 61, 1):
        print(
            f'Level: {i} | XP Required: {xp_required_to_level(i)} | reduction_factor: {reduction_factor(i)} | difficulty_factor: {difficulty_factor(i)} | max_xp_per_kill: {max_xp_earned(i)}')
        for x in range(-8, 8, 1):
            print(xp_earned(i, i-x))
