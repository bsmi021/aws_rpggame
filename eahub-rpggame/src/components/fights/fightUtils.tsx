import { IAttack } from '../../types/FightTypes';
import { IEnemy } from '../../types/EnemyTypes';

export const enemyHealthBarColor = (currHp: number, baseHp: number) => {
  const enemyLifeLeftPct = currHp / baseHp;

  if (enemyLifeLeftPct > 0.66) {
    return 'green';
  } else if (enemyLifeLeftPct > 0.33) {
    return 'yellow';
  } else if (enemyLifeLeftPct > 0.17) {
    return 'orange';
  } else if (enemyLifeLeftPct > 0) {
    return 'red';
  } else {
    return 'grey';
  }
};

export const getAttackText = (attack: IAttack, enemy: IEnemy) => {
  const en_name = enemy.en_race_name.toLowerCase();
  if (attack.is_missed) {
    return `You missed the ${en_name}.`;
  }
  if (attack.is_dodged) {
    return `The ${en_name} dodged your attack.`;
  }
  if (attack.is_blocked) {
    return `The ${en_name} blocked your attack you only hit them for ${attack.attack_amt} damage.`;
  }
  if (attack.is_critical) {
    return `You critically hit the ${en_name} for ${attack.attack_amt} damage!`;
  }

  return `You hit the ${en_name} for ${attack.attack_amt} damage.`;
};
