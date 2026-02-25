// https://pokeapi.co/api/v2/pokemon-species/{id}
import { PokemonService } from "../services/pokemon-service";

// https://pokeapi.co/api/v2/pokemon-species/{id}
export interface PokemonSpeciesRef{
  name: string;
  url: string;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;

  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;

  growth_rate: PokemonSpeciesRef;
  pokedex_numbers: {
    entry_number: number;
    pokedex: PokemonSpeciesRef;
  }[];

  egg_groups: PokemonSpeciesRef[];

  color: PokemonSpeciesRef;
  shape: PokemonSpeciesRef;
  habitat: PokemonSpeciesRef | null;
  generation: PokemonSpeciesRef;

  evolves_from_species: PokemonSpeciesRef | null;
  evolution_chain: {
    url: string;
  };

  flavor_text_entries: {
    flavor_text: string;
    language: PokemonSpeciesRef;
    version: PokemonSpeciesRef;
  }[];

  genera: {
    genus: string;
    language: PokemonSpeciesRef;
  }[];

  names: {
  name: string;
  language: PokemonSpeciesRef;
  }[];

  varieties: {
    is_default: boolean;
    pokemon: PokemonSpeciesRef;
  }[];
}
