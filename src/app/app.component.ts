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
  pokemonMoveId: number = 25; // ejemplo inicial (Pikachu)
  pokemonChainId: number = 25; // ejemplo inicial (Pikachu)
  speciesId : number = 25;

  state = signal<LoadState>('idle');
  pokemon = signal<Pokemon | null>(null);
  errorMsg = signal<string>('');

  moveState = signal<LoadState>('idle');
  move = signal<PokemonMove | null>(null);
  moveErrorMsg = signal<string>('');

  chainState = signal<LoadState>('idle');
  chain = signal<PokemonChain | null>(null);
  chainErrorMsg = signal<string>('');

  speciesState = signal<LoadState>('idle');
  species = signal<PokemonSpecies | null>(null);
  speciesErrorMsg = signal<string>('');

  moveImage = signal<string | null>(null);
  chainImage = signal<string | null>(null);

  endpointPreview = computed(() =>
    `https://pokeapi.co/api/v2/pokemon/${this.pokemonId || ''}`
  );

  endpointPreviewMove = computed(() =>
    `https://pokeapi.co/api/v2/move/${this.pokemonMoveId || ''}`
  );

  endpointPreviewChain = computed(() =>
    `https://pokeapi.co/api/v2/evolution-chain/${this.pokemonChainId || ''}`
  );

  primaryType = computed(() => {
    const p = this.pokemon();
    return p?.types?.[0]?.type?.name ?? '';
  });

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemon();
    this.loadMove();
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
        this.speciesState.set('error');
        this.speciesErrorMsg.set('Please enter a valid numeric ID (>= 1).');
        return;
      }

      this.speciesState.set('loading');
      this.errorMsg.set('');
      this.species.set(null);

      this.pokemonService.getPokemonSpecies(String(id)).subscribe({
        next: (s) => {
          this.species.set(s);
          this.speciesState.set('success');
        },
        error: (err) => {
          const msg =
            err?.status === 404
              ? 'Species not found (404).'
              : err?.message
              ? String(err.message)
              : 'Unknown error calling the API.';

          this.speciesErrorMsg.set(msg);
          this.speciesState.set('error');
        },
      });
  }

  loadMove(): void {
    const id = Number(this.pokemonMoveId);

    if (!Number.isFinite(id) || id <= 0) {
      this.moveState.set('error');
      this.moveErrorMsg.set('Please enter a valid numeric ID (>= 1).');
      return;
    }

    this.moveState.set('loading');
    this.moveErrorMsg.set('');
    this.move.set(null);

    this.pokemonService.getMove(String(id)).subscribe({
      next: (m) => {
        this.move.set(m);
        this.moveState.set('success');
        this.loadPokemonImage(id, 'move');
      },
      error: (err) => {
        const msg =
          err?.status === 404
            ? 'Pokemon not found (404).'
            : err?.message
            ? String(err.message)
            : 'Unknown error calling the API.';

        this.moveErrorMsg.set(msg);
        this.moveState.set('error');
      },
    });
  }

  loadEvolutionChain(): void {
    const id = Number(this.pokemonChainId);

    if (!Number.isFinite(id) || id <= 0) {
      this.chainState.set('error');
      this.chainErrorMsg.set('Please enter a valid numeric ID (>= 1).');
      return;
    }

    this.chainState.set('loading');
    this.chainErrorMsg.set('');
    this.chain.set(null);

    this.pokemonService.getChain(String(id)).subscribe({
      next: (c) => {
        this.chain.set(c);
        this.chainState.set('success');
        this.loadPokemonImage(id, 'chain');
      },
      error: (err) => {
        const msg =
          err?.status === 404
            ? 'Pokemon not found (404).'
            : err?.message
            ? String(err.message)
            : 'Unknown error calling the API.';

        this.chainErrorMsg.set(msg);
        this.chainState.set('error');
      },
    }); 
  }
  //Carga de datos para primer endpoint
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
  //Carga de datos para segundo endpoint
  moveEffect = computed(() => {
    const m = this.move();
    if (!m) return '';

    const entry = m.effect_entries.find(
      e => e.language?.name === 'en'
    );

    return entry?.effect ?? 'No effect description available.';
  });

  moveFlavor = computed(() => {
    const m = this.move();
    if (!m) return '';

    const entry = m.flavor_text_entries.find(
      e => e.language?.name === 'en'
    );

    return entry?.flavor_text ?? '';
  });
  //Carga de datos para cuarto endpoint
  evolutionNames = computed(() => {
    const c = this.chain();
    if (!c) return [];

    const result: string[] = [];

    const traverse = (link: any) => {
      result.push(link.species.name);

      if (link.evolves_to?.length) {
        link.evolves_to.forEach((e: any) => traverse(e));
      }
    };

    traverse(c.chain);

    return result;
  });
  //carga de datos pata especies 
  getEnglishFlavorText(): string | undefined {
    return this.species()?.flavor_text_entries
      .find(f => f.language.name === 'en')?.flavor_text;
  }
  //metodo para obtener imagen
  private loadPokemonImage(id: number, target: 'move' | 'chain') {
    this.pokemonService.getPokemon(String(id)).subscribe({
      next: (p) => {
        const image = p.sprites.front_default;

        if (target === 'move') {
          this.moveImage.set(image);
        }

        if (target === 'chain') {
          this.chainImage.set(image);
        }
      },
      error: () => {
        if (target === 'move') this.moveImage.set(null);
        if (target === 'chain') this.chainImage.set(null);
      }
    });
  }
}
