export interface IItem {
  id: string;
  name: string;
  created_at: Date;
  modified_at: Date;
  description: string;
  quality: number;
  quality_name: string;
  slot: number;
  slot_name: string;
  damage: number;
  stamina: number;
  crit_chance: string;
}
