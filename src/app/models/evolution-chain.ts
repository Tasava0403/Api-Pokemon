// https://pokeapi.co/api/v2/evolution-chain/{id}
export interface PokemonChain {
  id: number;
  chain: ChainLink;
}

export interface ChainLink{
  species: {
    name: string;
    url: string;
  };
  evolution_details: {
    min_level: number | null;
    trigger: {
      name: string;
    };
  }[];
  evolves_to: ChainLink[];
}