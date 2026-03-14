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
  templateUrl: './pokemon-search.component.html',
  styleUrl: './pokemon-search.component.css'
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
