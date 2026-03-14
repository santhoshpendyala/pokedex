import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService, EvolutionLink } from '../../services/pokemon.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css',
})
export class PokemonDetailComponent {
  private pokemonService = inject(PokemonService);
  pokemon = this.pokemonService.selectedPokemon;

  evolutionChain = signal<EvolutionLink | null>(null);
  isEvolutionExpanded = signal(false);
  isLoadingEvolution = signal(false);

  constructor() {
    effect(() => {
      const p = this.pokemon();
      if (p) {
        this.fetchEvolution(p.id);
      } else {
        this.evolutionChain.set(null);
        this.isEvolutionExpanded.set(false);
      }
    });
  }

  async fetchEvolution(id: number) {
    this.isLoadingEvolution.set(true);
    const chain = await this.pokemonService.getEvolutionChain(id);
    this.evolutionChain.set(chain);
    this.isLoadingEvolution.set(false);
  }

  toggleEvolution() {
    this.isEvolutionExpanded.update(v => !v);
  }

  close() {
    this.pokemonService.selectPokemon(null);
  }

  toggleFavorite(event: Event, id: number) {
    event.stopPropagation();
    this.pokemonService.toggleFavorite(id);
  }

  isFavorite(id: number): boolean {
    return this.pokemonService.isFavorite(id);
  }

  getTypeClass(type: string): string {
    return `type-${type.toLowerCase()}`;
  }

  getTypeBg(type: string): string {
    const colors: Record<string, string> = {
      'Fire': 'bg-orange-600',
      'Water': 'bg-blue-600',
      'Grass': 'bg-green-600',
      'Electric': 'bg-yellow-500',
      'Psychic': 'bg-purple-600',
      'Fighting': 'bg-red-800',
      'Normal': 'bg-gray-500',
      'Poison': 'bg-purple-800',
      'Ground': 'bg-yellow-800',
      'Flying': 'bg-indigo-400',
      'Bug': 'bg-lime-600',
      'Rock': 'bg-stone-600',
      'Ghost': 'bg-violet-800',
      'Dragon': 'bg-indigo-700',
      'Steel': 'bg-slate-400',
      'Dark': 'bg-zinc-800',
      'Fairy': 'bg-pink-400'
    };
    return colors[type] || 'bg-gray-400';
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'Fire': 'local_fire_department',
      'Water': 'water_drop',
      'Grass': 'eco',
      'Electric': 'bolt',
      'Psychic': 'auto_awesome',
      'Fighting': 'fitness_center',
      'Normal': 'circle',
      'Poison': 'science',
      'Ground': 'terrain',
      'Flying': 'air',
      'Bug': 'pest_control',
      'Rock': 'mountain',
      'Ghost': 'dark_mode',
      'Dragon': 'legend_toggle',
      'Steel': 'settings',
      'Dark': 'nights_stay',
      'Fairy': 'favorite'
    };
    return icons[type] || 'help';
  }
}
