import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon';
import { PokemonSpecies } from '../models/pokemon-species';
import { PokemonMove } from '../models/pokemon-move';
import { PokemonChain } from '../models/evolution-chain';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/';
  private readonly baseSpeciesUrl ='https://pokeapi.co/api/v2/pokemon-species/{id}';

  constructor(private http: HttpClient) {}

  // https://pokeapi.co/api/v2/pokemon/{id}
  getPokemon(id: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}pokemon/${id}`);
  }

  // https://pokeapi.co/api/v2/move/{id}
  getMove(id: string): Observable<PokemonMove> {
    return this.http.get<PokemonMove>(`${this.baseUrl}move/${id}`);
  }

  // https://pokeapi.co/api/v2/evolution-chain/{id}
  getChain(id: string): Observable<PokemonChain> {
    return this.http.get<PokemonChain>(`${this.baseUrl}evolution-chain/${id}`);
  }

    getPokemonSpecies(id: string) {
    return this.http.get<PokemonSpecies>(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    }
}
