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
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h2 class="text-4xl font-black tracking-tighter text-slate-900 uppercase">
          Pokémon <span class="text-blue-600">Comparison</span>
        </h2>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Compare stats, types, and abilities of up to 3 Pokémon</p>
      </div>

      @if (pokemonService.comparisonList().length === 0) {
        <div class="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-100">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-4xl text-slate-300">compare_arrows</mat-icon>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">No Pokémon selected for comparison</h3>
          <p class="text-slate-500 mb-8">Go to the search page or home to add Pokémon to your comparison list.</p>
          <a routerLink="/search" class="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <mat-icon>search</mat-icon>
            <span>Start Searching</span>
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (p of pokemonService.comparisonList(); track p.id) {
            <div class="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 relative group animate-in fade-in zoom-in duration-500">
              <!-- Remove Button -->
              <button (click)="pokemonService.removeFromComparison(p.id)" 
                      class="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 transition-all">
                <mat-icon>close</mat-icon>
              </button>

              <!-- Image Section -->
              <div class="aspect-square bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <img [src]="p.image" [alt]="p.name" class="w-full h-full object-contain relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <div class="absolute bottom-6 left-6 z-10">
                   <span class="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">#{{ p.id }}</span>
                </div>
              </div>

              <!-- Content Section -->
              <div class="p-8">
                <h3 class="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">{{ p.name }}</h3>
                
                <!-- Types -->
                <div class="flex gap-2 mb-8">
                  @for (type of p.types; track type) {
                    <span [ngClass]="getTypeClass(type)" class="px-4 py-1.5 rounded-xl text-xs font-black text-white uppercase tracking-widest shadow-sm">
                      {{ type }}
                    </span>
                  }
                </div>

                <!-- Stats Grid -->
                <div class="space-y-6">
                  <div class="space-y-2">
                    <div class="flex justify-between items-end">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">HP</span>
                      <span class="text-sm font-black text-slate-900">{{ p.hp }}</span>
                    </div>
                    <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-red-500 rounded-full" [style.width.%]="(p.hp / 255) * 100"></div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <div class="flex justify-between items-end">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attack</span>
                        <span class="text-sm font-black text-slate-900">{{ p.attack }}</span>
                      </div>
                      <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-orange-500 rounded-full" [style.width.%]="((p.attack || 0) / 190) * 100"></div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between items-end">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Defense</span>
                        <span class="text-sm font-black text-slate-900">{{ p.defense }}</span>
                      </div>
                      <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full" [style.width.%]="((p.defense || 0) / 230) * 100"></div>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <div class="flex justify-between items-end">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sp. Atk</span>
                        <span class="text-sm font-black text-slate-900">{{ p.specialAttack }}</span>
                      </div>
                      <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-purple-500 rounded-full" [style.width.%]="((p.specialAttack || 0) / 194) * 100"></div>
                      </div>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between items-end">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sp. Def</span>
                        <span class="text-sm font-black text-slate-900">{{ p.specialDefense }}</span>
                      </div>
                      <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-green-500 rounded-full" [style.width.%]="((p.specialDefense || 0) / 230) * 100"></div>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between items-end">
                      <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speed</span>
                      <span class="text-sm font-black text-slate-900">{{ p.speed }}</span>
                    </div>
                    <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-yellow-500 rounded-full" [style.width.%]="((p.speed || 0) / 180) * 100"></div>
                    </div>
                  </div>
                </div>

                <!-- Abilities -->
                <div class="mt-8 pt-8 border-t border-slate-100">
                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Abilities</span>
                   <div class="flex flex-wrap gap-2">
                      <span class="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase">{{ p.primaryAbility }}</span>
                      @if (p.secondaryAbility) {
                        <span class="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 uppercase">{{ p.secondaryAbility }}</span>
                      }
                   </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
      min-height: 100vh;
    }
  `]
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
