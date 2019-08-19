import { ICharacter } from '../../types/CharacterTypes';
import { useSelector } from 'react-redux';
import { IApplicationState } from '../../store/Store';

export const classIcon = (className: string) => {
  switch (className) {
    case 'WARRIOR':
      return '/icons/warrior.png';
    case 'ARCHER':
      return '/icons/archer.jpg';
    case 'SORCERER':
      return '/icons/sorcerer.png';
    case 'ROGUE':
      return '/icons/rogue.png';
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
