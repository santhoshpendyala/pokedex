import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonListComponent } from '../pokemon-list/pokemon-list.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, PokemonListComponent, MatIconModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Search Header -->
      <div class="mb-12 text-center">
        <h2 class="text-4xl font-black tracking-tighter text-slate-900 uppercase">
          Find Your <span class="text-blue-600">Pokémon</span>
        </h2>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Search through the ultimate database of 2000 Pokémon</p>
      </div>

      <!-- Search Filters -->
      <div class="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-slate-100 relative overflow-hidden">
        <!-- Background Decoration -->
        <div class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-50/50"></div>
        
        <div class="relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Name Search -->
            <div class="space-y-2">
              <label for="name-search" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</mat-icon>
                <input 
                  id="name-search"
                  type="text" 
                  [ngModel]="pokemonService.searchPageQuery()"
                  (ngModelChange)="pokemonService.searchPageQuery.set($event)"
                  placeholder="e.g. Pikachu"
                  class="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <!-- ID Search -->
            <div class="space-y-2">
              <label for="id-search" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ID Number</label>
              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">tag</mat-icon>
                <input 
                  id="id-search"
                  type="number" 
                  [ngModel]="pokemonService.searchPageId()"
                  (ngModelChange)="pokemonService.searchPageId.set($event)"
                  placeholder="e.g. 25"
                  class="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <!-- Min HP Search -->
            <div class="space-y-2">
              <label for="hp-search" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum HP</label>
              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">favorite</mat-icon>
                <input 
                  id="hp-search"
                  type="number" 
                  [ngModel]="pokemonService.searchPageMinHp()"
                  (ngModelChange)="pokemonService.searchPageMinHp.set($event)"
                  placeholder="e.g. 50"
                  class="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <!-- Type Search -->
            <div class="space-y-2">
              <label for="type-search" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Elemental Type</label>
              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">category</mat-icon>
                <select 
                  id="type-search"
                  [ngModel]="pokemonService.searchPageType()"
                  (ngModelChange)="pokemonService.searchPageType.set($event)"
                  class="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none appearance-none"
                >
                  <option value="">All Types</option>
                  @for (type of types; track type) {
                    <option [value]="type">{{ type }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Generation Search -->
            <div class="space-y-2">
              <label for="gen-search" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Generation</label>
              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">auto_awesome</mat-icon>
                <select 
                  id="gen-search"
                  [ngModel]="pokemonService.searchPageGeneration()"
                  (ngModelChange)="pokemonService.searchPageGeneration.set($event)"
                  class="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none appearance-none"
                >
                  <option [ngValue]="null">All Generations</option>
                  @for (gen of generations; track gen) {
                    <option [value]="gen">Gen {{ gen }}</option>
                  }
                </select>
              </div>
            </div>

            <!-- Primary Ability Search -->
            <div class="space-y-2">
              <label for="primary-ability-search" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Ability</label>
              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">bolt</mat-icon>
                <input 
                  id="primary-ability-search"
                  type="text" 
                  [ngModel]="pokemonService.searchPagePrimaryAbility()"
                  (ngModelChange)="pokemonService.searchPagePrimaryAbility.set($event)"
                  placeholder="e.g. Overgrow"
                  class="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <!-- Secondary Ability Search -->
            <div class="space-y-2">
              <label for="secondary-ability-search" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secondary Ability</label>
              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">shield</mat-icon>
                <input 
                  id="secondary-ability-search"
                  type="text" 
                  [ngModel]="pokemonService.searchPageSecondaryAbility()"
                  (ngModelChange)="pokemonService.searchPageSecondaryAbility.set($event)"
                  placeholder="e.g. Chlorophyll"
                  class="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <!-- Action Bar -->
          <div class="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
              <button 
                (click)="pokemonService.searchPageFavoritesOnly.set(!pokemonService.searchPageFavoritesOnly())"
                class="flex items-center space-x-2 rounded-xl px-6 py-3 text-sm font-bold transition-all"
                [class.bg-pink-500]="pokemonService.searchPageFavoritesOnly()"
                [class.text-white]="pokemonService.searchPageFavoritesOnly()"
                [class.shadow-lg]="pokemonService.searchPageFavoritesOnly()"
                [class.shadow-pink-200]="pokemonService.searchPageFavoritesOnly()"
                [class.bg-slate-100]="!pokemonService.searchPageFavoritesOnly()"
                [class.text-slate-600]="!pokemonService.searchPageFavoritesOnly()">
                <mat-icon class="text-lg">{{ pokemonService.searchPageFavoritesOnly() ? 'favorite' : 'favorite_border' }}</mat-icon>
                <span>Favorites Only</span>
              </button>

              <button 
                (click)="resetFilters()"
                class="flex items-center space-x-2 rounded-xl px-6 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all">
                <mat-icon class="text-lg">refresh</mat-icon>
                <span>Reset All</span>
              </button>
            </div>

            <div class="text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Results Found</p>
              <p class="text-xl font-black text-slate-900">
                {{ pokemonService.searchPageFilteredPokemon().length }} 
                <span class="text-xs font-bold text-slate-400 uppercase">Pokémon</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Grid -->
      <app-pokemon-list [showFilters]="false" [customPokemonList]="pokemonService.searchPageFilteredPokemon()"></app-pokemon-list>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PokemonSearchComponent {
  pokemonService = inject(PokemonService);
  
  types = ['Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy'];
  generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  resetFilters() {
    this.pokemonService.searchPageQuery.set('');
    this.pokemonService.searchPageId.set(null);
    this.pokemonService.searchPageMinHp.set(null);
    this.pokemonService.searchPageType.set('');
    this.pokemonService.searchPageGeneration.set(null);
    this.pokemonService.searchPagePrimaryAbility.set('');
    this.pokemonService.searchPageSecondaryAbility.set('');
    this.pokemonService.searchPageFavoritesOnly.set(false);
  }
}
