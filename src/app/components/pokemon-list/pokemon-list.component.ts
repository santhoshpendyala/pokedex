import { Component, inject, signal, computed, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon';
import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, PokemonCardComponent, PokemonDetailComponent, MatIconModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Detail View Overlay -->
      <app-pokemon-detail></app-pokemon-detail>

      <!-- Search Filters (Optional) -->
      @if (showFilters()) {
        <div class="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 class="text-2xl font-bold mb-4 text-gray-800 flex items-center">
            <span class="material-icons mr-2 text-red-500">search</span>
            Search Pokémon
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Name Search -->
            <div class="relative">
              <label for="name-search" class="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
              <input 
                id="name-search"
                type="text" 
                [ngModel]="pokemonService.searchQuery()"
                (ngModelChange)="pokemonService.searchQuery.set($event)"
                placeholder="e.g. Pikachu"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              />
            </div>

            <!-- ID Search -->
            <div class="relative">
              <label for="id-search" class="block text-xs font-bold text-gray-500 uppercase mb-1">ID</label>
              <input 
                id="id-search"
                type="number" 
                [ngModel]="pokemonService.searchId()"
                (ngModelChange)="pokemonService.searchId.set($event)"
                placeholder="e.g. 25"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              />
            </div>

            <!-- Min HP Search -->
            <div class="relative">
              <label for="hp-search" class="block text-xs font-bold text-gray-500 uppercase mb-1">Min HP</label>
              <input 
                id="hp-search"
                type="number" 
                [ngModel]="pokemonService.minHp()"
                (ngModelChange)="pokemonService.minHp.set($event)"
                placeholder="e.g. 50"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              />
            </div>

            <!-- Type Search -->
            <div class="relative">
              <label for="type-search" class="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
              <select 
                id="type-search"
                [ngModel]="pokemonService.selectedType()"
                (ngModelChange)="pokemonService.selectedType.set($event)"
                class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              >
                <option value="">All Types</option>
                @for (type of types; track type) {
                  <option [value]="type">{{ type }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Favorites Toggle in Filter -->
          <div class="mt-6 flex flex-wrap items-center gap-4">
            <button 
              (click)="pokemonService.showFavoritesOnly.set(!pokemonService.showFavoritesOnly())"
              class="flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-bold transition-all"
              [class.bg-pink-500]="pokemonService.showFavoritesOnly()"
              [class.text-white]="pokemonService.showFavoritesOnly()"
              [class.shadow-lg]="pokemonService.showFavoritesOnly()"
              [class.shadow-pink-200]="pokemonService.showFavoritesOnly()"
              [class.bg-slate-100]="!pokemonService.showFavoritesOnly()"
              [class.text-slate-600]="!pokemonService.showFavoritesOnly()">
              <mat-icon class="text-lg">{{ pokemonService.showFavoritesOnly() ? 'favorite' : 'favorite_border' }}</mat-icon>
              <span>Favorites Only</span>
              @if (pokemonService.favorites().length > 0) {
                <span class="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                  {{ pokemonService.favorites().length }}
                </span>
              }
            </button>

            @if (pokemonService.showFavoritesOnly() && pokemonService.favorites().length > 0) {
              <button 
                (click)="clearAllFavorites()"
                class="flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                <mat-icon class="text-lg">delete_sweep</mat-icon>
                <span>Clear All</span>
              </button>
            }

            <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>
            
            <div class="flex-1 flex justify-between items-center text-sm text-gray-500">
              <span>Showing {{ displayedPokemon().length }} of {{ pokemonService.filteredPokemon().length }} results</span>
              <button 
                (click)="resetFilters()"
                class="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <span class="material-icons text-sm mr-1">refresh</span> Reset Filters
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (pokemon of displayedPokemon(); track pokemon.id) {
          <app-pokemon-card [pokemon]="pokemon"></app-pokemon-card>
        }
      </div>

      <!-- Loading State -->
      @if (pokemonService.allPokemon().length === 0) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
        </div>
      }

      <!-- Empty State -->
      @if (pokemonService.allPokemon().length > 0 && displayedPokemon().length === 0) {
        <div class="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          @if (pokemonService.showFavoritesOnly()) {
            <div class="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-pink-50 text-pink-500 shadow-inner">
              <mat-icon class="text-5xl">favorite_border</mat-icon>
            </div>
            <h3 class="text-2xl font-black text-slate-800 mb-2">No Favorites Yet</h3>
            <p class="text-slate-500 max-w-xs mx-auto">Click the heart icon on any Pokémon card to add it to your collection!</p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button (click)="pokemonService.showFavoritesOnly.set(false)" 
                      class="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95">
                Explore Pokémon
              </button>
            </div>
          } @else {
            <span class="material-icons text-6xl text-gray-300 mb-4">search_off</span>
            <p class="text-xl text-gray-500">No Pokémon found matching your criteria.</p>
          }
        </div>
      }

      <!-- Load More -->
      @if (hasMore()) {
        <div class="mt-8 text-center">
          <button 
            (click)="loadMore()"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Load More Pokémon
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PokemonListComponent {
  pokemonService = inject(PokemonService);
  showFilters = input(false);
  customPokemonList = input<Pokemon[] | null>(null);
  
  types = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy'];
  
  displayLimit = signal(20);

  sourcePokemonList = computed(() => {
    const custom = this.customPokemonList();
    return custom !== null ? custom : this.pokemonService.filteredPokemon();
  });

  displayedPokemon = computed(() => {
    return this.sourcePokemonList().slice(0, this.displayLimit());
  });

  hasMore = computed(() => {
    return this.displayedPokemon().length < this.sourcePokemonList().length;
  });

  loadMore() {
    this.displayLimit.update(limit => limit + 20);
  }

  clearAllFavorites() {
    if (confirm('Are you sure you want to clear all favorites?')) {
      this.pokemonService.clearAllFavorites();
    }
  }

  resetFilters() {
    this.pokemonService.searchQuery.set('');
    this.pokemonService.searchId.set(null);
    this.pokemonService.minHp.set(null);
    this.pokemonService.selectedType.set('');
    this.pokemonService.showFavoritesOnly.set(false);
    this.displayLimit.set(20);
  }
}
