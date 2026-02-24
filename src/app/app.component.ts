import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokemonService } from './services/pokemon-service';
import { Pokemon } from './models/pokemon';
import { PokemonSpecies } from './models/pokemon-species';
import { PokemonMove } from './models/pokemon-move';
import { PokemonChain } from './models/evolution-chain';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
   docsUrl = 'https://pokeapi.co/docs/v2';

  pokemonId: number = 25; // ejemplo inicial (Pikachu)
  speciesId : number = 10;

  state = signal<LoadState>('idle');
  pokemon = signal<Pokemon | null>(null);
  species = signal<PokemonSpecies | null>(null);
  errorMsg = signal<string>('');

  endpointPreview = computed(() =>
    `https://pokeapi.co/api/v2/pokemon/${this.pokemonId || ''}`
  );

  primaryType = computed(() => {
    const p = this.pokemon();
    return p?.types?.[0]?.type?.name ?? '';
  });

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemon();
  }

  quick(id: number): void {
    this.pokemonId = id;
    this.loadPokemon();
  }

  loadPokemon(): void {
    const id = Number(this.pokemonId);

    if (!Number.isFinite(id) || id <= 0) {
      this.state.set('error');
      this.errorMsg.set('Please enter a valid numeric ID (>= 1).');
      return;
    }

    this.state.set('loading');
    this.errorMsg.set('');
    this.pokemon.set(null);

    this.pokemonService.getPokemon(String(id)).subscribe({
      next: (p) => {
        this.pokemon.set(p);
        this.state.set('success');
      },
      error: (err) => {
        const msg =
          err?.status === 404
            ? 'Pokemon not found (404).'
            : err?.message
            ? String(err.message)
            : 'Unknown error calling the API.';

        this.errorMsg.set(msg);
        this.state.set('error');
      },
    });
  }
    loadSpecies(): void {
      const id = Number(this.speciesId);

      if (!Number.isFinite(id) || id <= 0) {
        this.state.set('error');
        this.errorMsg.set('Please enter a valid numeric ID (>= 1).');
        return;
      }

      this.state.set('loading');
      this.errorMsg.set('');
      this.species.set(null);

      this.pokemonService.getPokemonSpecies(String(id)).subscribe({
        next: (s) => {
          this.species.set(s);
          this.state.set('success');
        },
        error: (err) => {
          const msg =
            err?.status === 404
              ? 'Species not found (404).'
              : err?.message
              ? String(err.message)
              : 'Unknown error calling the API.';

          this.errorMsg.set(msg);
          this.state.set('error');
        },
      });
    }

  loadMove(): void {
    // Aqui va el motodo para hacer la consulta, este lo llama el boton 
  }

  loadEvolutionChain(): void {
    // Aqui va el motodo para hacer la consulta, este lo llama el boton 
  }

  getEnglishFlavorText(): string | undefined {
  return this.species()?.flavor_text_entries
    .find(f => f.language.name === 'en')?.flavor_text;
}
  abilityNames = computed(() => {
    const p = this.pokemon();
    if (!p) return '';
    return p.abilities.map(a => a.ability.name).join(', ');
  });

  async copyJson(): Promise<void> {
    const p = this.pokemon();
    if (!p) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(p, null, 2));
    } catch {
      // Clipboard puede estar bloqueado; ignorar.
    }
  }
}
