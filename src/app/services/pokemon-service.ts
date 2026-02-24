import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon';
import { PokemonSpecies } from '../models/pokemon-species';
import { PokemonMove } from '../models/pokemon-move';
import { PokemonChain } from '../models/evolution-chain';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
  private readonly baseSpeciesUrl ='https://pokeapi.co/api/v2/pokemon-species/{id}';

  constructor(private http: HttpClient) {}

  getPokemon(id: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}${id}`);
  }
 getPokemonSpecies(id: string) {
  return this.http.get<PokemonSpecies>(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  }
}
