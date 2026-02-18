export interface PokemonRef {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;

  abilities: {
    ability: PokemonRef;
    is_hidden: boolean;
    slot: number;
  }[];

  types: {
    type: PokemonRef;
  }[];

  sprites: {
    front_default: string;
  };
}
