export const enemyHealthBarColor = (currHp: number, baseHp: number) => {
  const enemyLifeLeftPct = currHp / baseHp;

  if (enemyLifeLeftPct > 0.75) {
    return 'green';
  } else if (enemyLifeLeftPct > 0.5) {
    return 'yellow';
  } else if (enemyLifeLeftPct > 0) {
    return 'red';
  } else {
    return 'grey';
  }
};
