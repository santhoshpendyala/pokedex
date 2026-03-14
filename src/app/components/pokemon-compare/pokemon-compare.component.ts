import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService } from '../../services/pokemon.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokemon-compare',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './pokemon-compare.component.html',
  styleUrl: './pokemon-compare.component.css'
})
export class PokemonCompareComponent {
  pokemonService = inject(PokemonService);

  getTypeClass(type: string): string {
    const colors: Record<string, string> = {
      Normal: 'bg-slate-400',
      Fire: 'bg-orange-500',
      Water: 'bg-blue-500',
      Grass: 'bg-emerald-500',
      Electric: 'bg-yellow-400',
      Ice: 'bg-cyan-400',
      Fighting: 'bg-red-700',
      Poison: 'bg-purple-500',
      Ground: 'bg-amber-600',
      Flying: 'bg-indigo-400',
      Psychic: 'bg-pink-500',
      Bug: 'bg-lime-500',
      Rock: 'bg-stone-600',
      Ghost: 'bg-violet-700',
      Dragon: 'bg-indigo-700',
      Steel: 'bg-slate-500',
      Dark: 'bg-zinc-800',
      Fairy: 'bg-pink-300'
    };
    return colors[type] || 'bg-slate-400';
  }
}
