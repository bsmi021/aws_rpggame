import { IItem } from '../items/ItemType';
import { number } from 'prop-types';

export interface ICharacter {
  id: string;
  name: string;
  account: string;
  level: number;
  base_hp: number;
  xp_gained: number;
  base_min_damage: number;
  base_max_damage: number;
  base_crit_chance: number;
  base_miss_chance: number;
  base_critical_multiplier: number;
  min_damage: number;
  max_damage: number;
  crit_chance: number;
  hit_points: number;
  current_hp: number;
  inventory?: IItem[];
}
