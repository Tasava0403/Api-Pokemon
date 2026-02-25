// https://pokeapi.co/api/v2/move/{id}
export interface PokemonMove {
  accuracy: number | null;
  power?: number | null;
  pp?: number;
  priority?: number;

  damage_class: {
    name: string;
    url?: string;
  };

  type?: {
    name: string;
    url?: string;
  };

  effect_entries: {
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url?: string;
    };
  }[];

  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url?: string;
    };
    version_group?: {
      name: string;
      url?: string;
    };
  }[];
}