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
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
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
