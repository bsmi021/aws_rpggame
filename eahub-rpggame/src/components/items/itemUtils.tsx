import * as React from 'react';

export const colorSelector = (quality: number) => {
  switch (quality) {
    case 2:
      return 'blue';
    case 3:
      return 'purple';
    case 4:
      return 'orange';
    default:
      return 'green';
  }
};

export const calcAttackPower = (level: number, quality: number) => {
  let power = level * 1.19 + 8.1;

  switch (quality) {
    case 2:
      power = power * 1.1;
      break;
    case 3:
      power = power * 1.375;
      break;
    default:
      break;
  }

  return Math.round(power);
};

export const calcCritChance = (level: number, quality: number) => {
  let crit = ((level + 10) * 1.85 * 44) / 44;

  switch (quality) {
    case 2:
      crit = crit * 1.1;
      break;
    case 3:
      crit = crit * 1.375;
      break;
    default:
      break;
  }
  crit = crit / 44;
  return (crit * 0.01).toFixed(6);
};

export const calcStamina = (level: number, quality: number) => {
  let stamina = level * 1.35 + 10;

  switch (quality) {
    case 2:
      stamina = stamina * 1.1;
      break;
    case 3:
      stamina = stamina * 1.375;
    default:
      break;
  }

  return Math.ceil(stamina);
};

export const itemSlotIcon = (slot: number) => {
  const iconPath = '/icons/items/';
  switch (slot) {
    case 1:
      return iconPath + '001-helmet.png';
    case 2:
      return iconPath + '006-armor.png';
    case 3:
      return iconPath + '005-shoulders.png';
    case 4:
      return iconPath + '014-pants.png';
    case 5:
      return iconPath + '012-bracelet.png';
    case 6:
      return iconPath + '007-gloves.png';
    case 7:
      return iconPath + '008-boot.png';
    case 8:
      return iconPath + '010-cape.png';
    case 9:
      return iconPath + '009-engagement.png';
    case 10:
      return iconPath + '009-engagement.png';
    case 11:
      return iconPath + '013-necklace.png';
    case 12:
      return iconPath + '003-sword.png';
    case 13:
      return iconPath + '002-cross-swords.png';
    case 14:
      return iconPath + '004-sceptre.png';
    case 15:
      return iconPath + '011-belt-and-buckle.png';
    default:
      return null;
  }
};

export const itemSlots = [
  { key: -99, text: '', value: -99 },
  { key: 1, text: 'HEAD', value: 1 },
  { key: 2, text: 'CHEST', value: 2 },
  { key: 3, text: 'SHOULDERS', value: 3 },
  { key: 4, text: 'LEGS', value: 4 },
  { key: 5, text: 'WRIST', value: 5 },
  { key: 6, text: 'HANDS', value: 6 },
  { key: 7, text: 'FEET', value: 7 },
  { key: 8, text: 'BACK', value: 8 },
  { key: 9, text: 'RING_1', value: 9 },
  { key: 10, text: 'RING_2', value: 10 },
  { key: 11, text: 'NECK', value: 11 },
  { key: 12, text: 'MAIN_HAND', value: 12 },
  { key: 13, text: 'OFF_HAND', value: 13 },
  { key: 14, text: 'BOTH_HAND', value: 14 },
  { key: 15, text: 'WAIST', value: 15 }
];

export const itemQualities = [
  { key: -99, text: '', value: -99 },
  { key: 1, text: 'COMMON', value: 1 },
  { key: 2, text: 'RARE', value: 2 },
  { key: 3, text: 'LEGENDARY', value: 3 }
];
