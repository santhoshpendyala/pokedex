export interface Pokemon {
  id: number;
  name: string;
  hp: number;
  types: string[];
  generation?: number;
  primaryAbility?: string;
  secondaryAbility?: string;
  image: string;
  svgImage?: string;
  description: string;
  attack?: number;
  defense?: number;
  specialAttack?: number;
  specialDefense?: number;
  speed?: number;
  moves?: { name: string; damage?: number; description: string }[];
  weakness?: string;
  resistance?: string;
  retreatCost?: number;
}
