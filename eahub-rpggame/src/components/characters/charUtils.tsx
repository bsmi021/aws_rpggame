import * as React from 'react';
import { ICharacter } from '../../types/CharacterTypes';

export const classIcon = (className: string) => {
  switch (className) {
    case 'WARRIOR':
      return '/icons/characters/015-helmet.png';
    case 'ARCHER':
      return '/icons/characters/018-cupids-bow.png';
    case 'SORCERER':
      return '/icons/characters/016-sorcery-book.png';
    case 'ROGUE':
      return '/icons/characters/017-dagger.png';
    default:
      return null;
  }
};

export const isMyCharacter = (account: string, userId?: string) => {
  return userId && userId.toLowerCase().trim() === account.toLowerCase().trim();
};

export const calcDps = (character: ICharacter) => {
  return (
    (character.min_damage + character.max_damage) /
    2 /
    (character.attack_speed / 1000)
  ).toFixed(2);
};

export const classDescription = (classId: number) => {
  switch (classId) {
    case 1:
      return (
        <div>
          The warrior is a fierce fighter, known for slower attack speed with
          more brutal result. The warrior can use single hand weapons as well as
          swing weapons with two hands.
        </div>
      );
    case 2:
      return (
        <span>
          The archer is a nimble fighter who attacks from range, with slower
          strikes from their bow that have massive impact. The archer can only
          use ranged weapons to attack, a ranged weapon will consume both hands.
        </span>
      );
    case 3:
      return (
        <span className="meta">
          The sorcerer casts damaging magic spells to vanquish their foe. A
          sorcerer can use both single hand weapons as well as two-handed
          weapons.
        </span>
      );
    case 4:
      return (
        <span className="content">
          The rogue is a nimble fighter who attacks quickly up close with their
          foe. A rogue cannot use two handed weapons, they use small weapons in
          both hands.
        </span>
      );
    default:
      return '';
  }
};
