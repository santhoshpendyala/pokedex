import { Component, input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../models/pokemon';
import { PokemonService } from '../../services/pokemon.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent {
  pokemon = input.required<Pokemon>();
  private pokemonService = inject(PokemonService);

  select() {
    this.pokemonService.selectPokemon(this.pokemon().id);
  }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.pokemonService.toggleFavorite(this.pokemon().id);
  }

  isFavorite() {
    return this.pokemonService.isFavorite(this.pokemon().id);
  }

  toggleCompare(event: Event) {
    event.stopPropagation();
    if (this.isInComparison()) {
      this.pokemonService.removeFromComparison(this.pokemon().id);
    } else {
      this.pokemonService.addToComparison(this.pokemon());
    }
  }

  isInComparison() {
    return this.pokemonService.isInComparison(this.pokemon().id);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    const id = this.pokemon().id;
    const fallbackId = (id - 1) % 1025 + 1;
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${fallbackId}.png`;
  }

  getTypeClass(type: string): string {
    const colors: Record<string, string> = {
      Normal: 'bg-gray-400',
      Fire: 'bg-red-500',
      Water: 'bg-blue-500',
      Grass: 'bg-green-500',
      Electric: 'bg-yellow-400 text-gray-800',
      Ice: 'bg-cyan-300 text-gray-800',
      Fighting: 'bg-red-700',
      Poison: 'bg-purple-500',
      Ground: 'bg-yellow-600',
      Flying: 'bg-indigo-400',
      Psychic: 'bg-pink-500',
      Bug: 'bg-lime-500',
      Rock: 'bg-yellow-700',
      Ghost: 'bg-purple-700',
      Dragon: 'bg-indigo-700',
      Steel: 'bg-gray-500',
      Dark: 'bg-gray-700',
      Fairy: 'bg-pink-300 text-gray-800'
    };
    return colors[type] || 'bg-gray-400';
  }
}
