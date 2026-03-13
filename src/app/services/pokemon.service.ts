import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../models/pokemon';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface EvolutionLink {
  speciesName: string;
  id: number;
  image: string;
  evolvesTo: EvolutionLink[];
}

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  public allPokemon = signal<Pokemon[]>([]);
  private platformId = inject(PLATFORM_ID);
  
  // Filters (Home/Browse)
  searchQuery = signal('');
  minHp = signal<number | null>(null);
  selectedType = signal<string>('');
  searchId = signal<number | null>(null);
  selectedGeneration = signal<number | null>(null);
  primaryAbilityQuery = signal<string>('');
  secondaryAbilityQuery = signal<string>('');
  selectedPokemon = signal<Pokemon | null>(null);
  comparisonList = signal<Pokemon[]>([]);
  favorites = signal<number[]>([]);
  showFavoritesOnly = signal<boolean>(false);

  // Search Page Specific Filters (Persistent across navigation)
  searchPageQuery = signal('');
  searchPageMinHp = signal<number | null>(null);
  searchPageType = signal<string>('');
  searchPageId = signal<number | null>(null);
  searchPageGeneration = signal<number | null>(null);
  searchPagePrimaryAbility = signal<string>('');
  searchPageSecondaryAbility = signal<string>('');
  searchPageFavoritesOnly = signal<boolean>(false);

  // Filtered list (Home/Browse)
  filteredPokemon = computed(() => {
    return this.filterPokemon(this.allPokemon(), {
      query: this.searchQuery(),
      hp: this.minHp(),
      type: this.selectedType(),
      id: this.searchId(),
      generation: this.selectedGeneration(),
      primaryAbility: this.primaryAbilityQuery(),
      secondaryAbility: this.secondaryAbilityQuery(),
      favsOnly: this.showFavoritesOnly(),
      favIds: this.favorites()
    });
  });

  // Filtered list (Search Page)
  searchPageFilteredPokemon = computed(() => {
    return this.filterPokemon(this.allPokemon(), {
      query: this.searchPageQuery(),
      hp: this.searchPageMinHp(),
      type: this.searchPageType(),
      id: this.searchPageId(),
      generation: this.searchPageGeneration(),
      primaryAbility: this.searchPagePrimaryAbility(),
      secondaryAbility: this.searchPageSecondaryAbility(),
      favsOnly: this.searchPageFavoritesOnly(),
      favIds: this.favorites()
    });
  });

  filterPokemon(list: Pokemon[], criteria: {
    query?: string,
    hp?: number | null,
    type?: string,
    id?: number | null,
    generation?: number | null,
    primaryAbility?: string,
    secondaryAbility?: string,
    favsOnly?: boolean,
    favIds?: number[]
  }): Pokemon[] {
    const query = (criteria.query || '').toLowerCase();
    const hp = criteria.hp;
    const type = criteria.type;
    const id = criteria.id;
    const generation = criteria.generation;
    const primaryAbility = (criteria.primaryAbility || '').toLowerCase();
    const secondaryAbility = (criteria.secondaryAbility || '').toLowerCase();
    const favsOnly = criteria.favsOnly || false;
    const favIds = criteria.favIds || [];

    return list.filter(p => {
      const matchesName = !query || p.name.toLowerCase().includes(query);
      const matchesHp = hp === null || hp === undefined || p.hp >= Number(hp);
      const matchesType = !type || p.types.includes(type);
      const matchesId = id === null || id === undefined || p.id === Number(id);
      const matchesGen = generation === null || generation === undefined || p.generation === Number(generation);
      const matchesPrimary = !primaryAbility || (p.primaryAbility?.toLowerCase().includes(primaryAbility));
      const matchesSecondary = !secondaryAbility || (p.secondaryAbility?.toLowerCase().includes(secondaryAbility));
      const matchesFav = !favsOnly || favIds.includes(p.id);

      return matchesName && matchesHp && matchesType && matchesId && matchesGen && matchesPrimary && matchesSecondary && matchesFav;
    });
  }

  private http = inject(HttpClient);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
      this.loadFavorites();
    }
  }

  private loadFavorites() {
    const saved = localStorage.getItem('pokemon_favorites');
    if (saved) {
      try {
        this.favorites.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites', e);
      }
    }
  }

  toggleFavorite(id: number) {
    this.favorites.update(favs => {
      const newFavs = favs.includes(id) 
        ? favs.filter(fid => fid !== id) 
        : [...favs, id];
      
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('pokemon_favorites', JSON.stringify(newFavs));
      }
      return newFavs;
    });
  }

  addToComparison(pokemon: Pokemon) {
    this.comparisonList.update(list => {
      if (list.length >= 3) return list;
      if (list.find(p => p.id === pokemon.id)) return list;
      return [...list, this.enrichPokemon(pokemon)];
    });
  }

  removeFromComparison(id: number) {
    this.comparisonList.update(list => list.filter(p => p.id !== id));
  }

  isInComparison(id: number): boolean {
    return !!this.comparisonList().find(p => p.id === id);
  }

  private enrichPokemon(pokemon: Pokemon): Pokemon {
    const enriched = { ...pokemon };
    if (!enriched.attack) enriched.attack = Math.floor(Math.random() * 100) + 50;
    if (!enriched.defense) enriched.defense = Math.floor(Math.random() * 100) + 50;
    if (!enriched.specialAttack) enriched.specialAttack = Math.floor(Math.random() * 100) + 50;
    if (!enriched.specialDefense) enriched.specialDefense = Math.floor(Math.random() * 100) + 50;
    if (!enriched.speed) enriched.speed = Math.floor(Math.random() * 100) + 50;
    
    // Ensure image is always valid
    if (!enriched.image || enriched.image.includes('undefined')) {
      const imageId = (enriched.id - 1) % 1025 + 1;
      enriched.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${imageId}.png`;
    }
    
    return enriched;
  }

  isFavorite(id: number): boolean {
    return this.favorites().includes(id);
  }

  clearAllFavorites() {
    this.favorites.set([]);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('pokemon_favorites');
    }
  }

  resetFilters() {
    this.searchQuery.set('');
    this.searchId.set(null);
    this.minHp.set(null);
    this.selectedType.set('');
    this.selectedGeneration.set(null);
    this.primaryAbilityQuery.set('');
    this.secondaryAbilityQuery.set('');
    this.showFavoritesOnly.set(false);
  }

  private async loadData() {
    try {
      interface RawPokemon extends Omit<Pokemon, 'types'> {
        type?: string[];
        types?: string[];
      }
      const rawData = await firstValueFrom(this.http.get<RawPokemon[]>('pokemon.json'));
      const initialData: Pokemon[] = rawData.map(p => {
        const gen = this.getGenerationById(p.id);
        const abilities = this.getRandomAbilities();
        return this.enrichPokemon({
          ...p,
          types: p.type || p.types || [],
          generation: gen,
          primaryAbility: abilities[0],
          secondaryAbility: abilities[1],
          image: p.image, // Use image directly from JSON
          svgImage: p.id <= 20 ? `assets/pokemon/${p.id}.svg` : undefined
        });
      });
      
      this.allPokemon.set(initialData);
    } catch (e) {
      console.error('Failed to load pokemon data', e);
      // Fallback generation if file fails
      this.allPokemon.set(this.generateFallback(2000));
    }
  }

  private generateFallback(count: number): Pokemon[] {
    const list: Pokemon[] = [];
    const types = ['Normal', 'Fire', 'Water', 'Grass', 'Electric'];
    for (let i = 1; i <= count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const imageId = (i - 1) % 1025 + 1;
      const gen = this.getGenerationById(i);
      const abilities = this.getRandomAbilities();
      list.push(this.enrichPokemon({
        id: i,
        name: `Pokemon ${i}`,
        hp: Math.floor(Math.random() * 100) + 50,
        types: [type],
        generation: gen,
        primaryAbility: abilities[0],
        secondaryAbility: abilities[1],
        image: imageId <= 20 ? `assets/pokemon/${imageId}.png` : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${imageId}.png`,
        svgImage: imageId <= 20 ? `assets/pokemon/${imageId}.svg` : undefined,
        description: `A fallback description for Pokemon ${i}. It is a ${type} type Pokémon.`
      }));
    }
    return list;
  }

  private getGenerationById(id: number): number {
    if (id <= 151) return 1;
    if (id <= 251) return 2;
    if (id <= 386) return 3;
    if (id <= 493) return 4;
    if (id <= 649) return 5;
    if (id <= 721) return 6;
    if (id <= 809) return 7;
    if (id <= 905) return 8;
    return 9;
  }

  private getRandomAbilities(): string[] {
    const abilities = [
      'Overgrow', 'Chlorophyll', 'Blaze', 'Solar Power', 'Torrent', 'Rain Dish', 'Shield Dust', 'Run Away', 'Shed Skin', 'Compound Eyes', 'Swarm', 'Keen Eye', 'Tangled Feet', 'Guts', 'Intimidate', 'Static', 'Sand Veil', 'Poison Point', 'Rivalry', 'Cute Charm', 'Magic Guard', 'Flash Fire', 'Drought', 'Inner Focus', 'Synchronize', 'Levitate', 'Sturdy', 'Rock Head', 'Oblivious', 'Own Tempo', 'Clear Body', 'Liquid Ooze', 'Water Absorb', 'Volt Absorb', 'Pressure', 'Serene Grace', 'Natural Cure', 'Trace', 'Adaptability', 'Skill Link', 'Technician', 'Quick Feet', 'Iron Fist', 'Reckless', 'Gluttony', 'Anger Point', 'Unburden', 'Heatproof', 'Simple', 'Dry Skin', 'Anticipation', 'Forewarn', 'Frisk', 'Filter', 'Solid Rock', 'Hydration', 'Bad Dreams', 'Victory Star', 'Turboblaze', 'Teravolt', 'Moxie', 'Justified', 'Rattled', 'Magic Bounce', 'Regenerator', 'Sand Force', 'Sheer Force', 'Defiant', 'Competitive', 'Sap Sipper', 'Prankster', 'Cursed Body', 'Weak Armor', 'Heavy Metal', 'Light Metal', 'Multiscale', 'Toxic Boost', 'Flare Boost', 'Harvest', 'Telepathy', 'Overcoat', 'Big Pecks', 'Sand Rush', 'Wonder Skin', 'Analytic', 'Infiltrator', 'Mummy', 'Defeatist', 'Illusion', 'Imposter', 'Iron Barbs', 'Zen Mode', 'Victory Star', 'Turboblaze', 'Teravolt'
    ];
    const a1 = abilities[Math.floor(Math.random() * abilities.length)];
    let a2 = abilities[Math.floor(Math.random() * abilities.length)];
    while (a1 === a2) {
      a2 = abilities[Math.floor(Math.random() * abilities.length)];
    }
    return [a1, a2];
  }

  selectPokemon(id: number | null) {
    if (id === null) {
      this.selectedPokemon.set(null);
      return;
    }

    const pokemon = this.allPokemon().find(p => p.id === id);
    if (pokemon) {
      // Enrich with TCG data if not already present
      const enriched = this.enrichPokemon(pokemon);
      if (!enriched.moves) {
        enriched.moves = [
          { 
            name: 'Quick Attack', 
            damage: 20, 
            description: 'Flip a coin. If heads, this attack does 10 more damage.' 
          },
          { 
            name: 'Elemental Blast', 
            damage: 60, 
            description: 'Discard 2 energy cards attached to this Pokémon.' 
          }
        ];
      }
      if (!enriched.weakness) enriched.weakness = this.getWeakness(enriched.types[0]);
      if (!enriched.resistance) enriched.resistance = this.getResistance(enriched.types[0]);
      if (!enriched.retreatCost) enriched.retreatCost = Math.floor(Math.random() * 3) + 1;

      this.selectedPokemon.set(enriched);
    }
  }

  private getWeakness(type: string): string {
    const chart: Record<string, string> = {
      'Fire': 'Water',
      'Water': 'Electric',
      'Grass': 'Fire',
      'Electric': 'Ground',
      'Psychic': 'Psychic',
      'Fighting': 'Psychic',
      'Normal': 'Fighting'
    };
    return chart[type] || 'None';
  }

  private getResistance(type: string): string {
    const chart: Record<string, string> = {
      'Fire': 'Grass',
      'Water': 'Fire',
      'Grass': 'Water',
      'Electric': 'Steel',
      'Psychic': 'Fighting'
    };
    return chart[type] || 'None';
  }

  async getEvolutionChain(pokemonId: number): Promise<EvolutionLink | null> {
    try {
      // 1. Get species info
      const speciesData = await firstValueFrom(
        this.http.get<{ evolution_chain: { url: string } }>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`)
      );
      
      // 2. Get evolution chain data
      const evolutionChainUrl = speciesData.evolution_chain.url;
      const chainData = await firstValueFrom(this.http.get<{ chain: PokeApiEvolutionChain }>(evolutionChainUrl));
      
      // 3. Parse the chain
      return this.parseEvolutionChain(chainData.chain);
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
      return null;
    }
  }

  private parseEvolutionChain(chain: PokeApiEvolutionChain): EvolutionLink {
    const speciesName = chain.species.name;
    const id = this.extractIdFromUrl(chain.species.url);
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    
    return {
      speciesName,
      id,
      image,
      evolvesTo: chain.evolves_to.map((next: PokeApiEvolutionChain) => this.parseEvolutionChain(next))
    };
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10);
  }
}

interface PokeApiEvolutionChain {
  species: { name: string; url: string };
  evolves_to: PokeApiEvolutionChain[];
}
