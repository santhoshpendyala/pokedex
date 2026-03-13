import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonService, EvolutionLink } from '../../services/pokemon.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (pokemon(); as p) {
      <div class="fixed inset-0 z-[100] flex justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" 
           (click)="close()" 
           (keydown.escape)="close()"
           tabindex="0"
           role="dialog"
           aria-modal="true">
        <div class="relative max-w-md w-full my-auto py-12 animate-tcg-entry" 
             (click)="$event.stopPropagation()"
             (keydown)="$event.stopPropagation()"
             tabindex="0">
          
          <!-- Close Button -->
          <button (click)="close()" 
                  class="absolute top-4 right-0 z-[110] w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-white/20">
            <mat-icon>close</mat-icon>
          </button>

          <!-- TCG Card Container -->
          <div class="pokemon-card-tcg relative aspect-[63/88] w-full rounded-[2rem] overflow-hidden shadow-2xl border-[12px] border-yellow-500 bg-yellow-100 tcg-holographic"
               [ngClass]="getTypeClass(p.types[0])">
            
            <!-- Favorite Button in Detail -->
            <button 
              (click)="toggleFavorite($event, p.id)"
              class="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 group/fav-detail"
              [class.text-red-500]="isFavorite(p.id)"
              [class.text-slate-400]="!isFavorite(p.id)">
              <mat-icon class="scale-125 transition-all duration-300 group-hover/fav-detail:text-red-400"
                        [class.animate-bounce-once]="isFavorite(p.id)">
                {{ isFavorite(p.id) ? 'favorite' : 'favorite_border' }}
              </mat-icon>
            </button>

            <!-- Card Header -->
            <div class="flex justify-between items-start p-4 pb-0 pl-16">
              <div class="flex flex-col">
                <span class="text-[0.6rem] uppercase font-bold opacity-70">Basic Pokémon</span>
                <h2 class="text-2xl font-bold tracking-tight text-gray-900 leading-none break-words max-w-[180px]">{{ p.name }}</h2>
              </div>
              <div class="flex items-center space-x-1">
                <span class="text-red-600 font-bold text-xl"><span class="text-xs">HP</span>{{ p.hp }}</span>
                <div class="w-6 h-6 rounded-full shadow-inner flex items-center justify-center" [ngClass]="getTypeBg(p.types[0])">
                   <mat-icon class="text-[14px] w-auto h-auto text-white">{{ getTypeIcon(p.types[0]) }}</mat-icon>
                </div>
              </div>
            </div>

            <!-- Pokemon Image Area -->
            <div class="mx-4 mt-2 mb-4 relative aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-sm border-4 border-gray-400 shadow-inner overflow-hidden">
              <img [src]="p.image" [alt]="p.name" class="w-full h-full object-contain p-4 drop-shadow-2xl" referrerpolicy="no-referrer">
              <div class="absolute bottom-0 left-0 right-0 bg-yellow-500/80 py-0.5 px-2 text-[0.6rem] italic text-center font-medium border-t border-yellow-600">
                NO. {{ p.id }}  HT: 2'04"  WT: 15.2 lbs.  GEN: {{ p.generation }}
              </div>
            </div>

            <!-- Abilities Display -->
            <div class="px-6 mb-2 flex flex-wrap gap-2">
              @if (p.primaryAbility) {
                <div class="flex items-center bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                  <mat-icon class="text-[10px] w-auto h-auto mr-1 text-blue-500">bolt</mat-icon>
                  <span class="text-[0.6rem] font-bold text-blue-700 uppercase">{{ p.primaryAbility }}</span>
                </div>
              }
              @if (p.secondaryAbility) {
                <div class="flex items-center bg-purple-50 border border-purple-200 rounded px-2 py-0.5">
                  <mat-icon class="text-[10px] w-auto h-auto mr-1 text-purple-500">shield</mat-icon>
                  <span class="text-[0.6rem] font-bold text-purple-700 uppercase">{{ p.secondaryAbility }}</span>
                </div>
              }
            </div>

            <!-- Abilities / Moves -->
            <div class="px-6 space-y-4">
              @for (move of p.moves; track move.name) {
                <div class="border-b border-gray-300/50 pb-2 last:border-0">
                  <div class="flex justify-between items-center mb-1">
                    <div class="flex items-center space-x-2">
                      <div class="flex space-x-0.5">
                        <div class="w-4 h-4 rounded-full bg-gray-400"></div>
                        <div class="w-4 h-4 rounded-full bg-gray-400"></div>
                      </div>
                      <span class="font-bold text-lg text-gray-900">{{ move.name }}</span>
                    </div>
                    <span class="font-bold text-xl text-gray-900">{{ move.damage }}</span>
                  </div>
                  <p class="text-[0.7rem] leading-tight text-gray-700 italic">{{ move.description }}</p>
                </div>
              }
            </div>

            <!-- Card Footer Stats -->
            <div class="absolute bottom-12 left-0 right-0 px-6 grid grid-cols-3 gap-2 text-[0.6rem] font-bold uppercase text-gray-800">
              <div class="flex flex-col items-center">
                <span>Weakness</span>
                <div class="flex items-center mt-1">
                  <div class="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mr-1">
                    <mat-icon class="text-[8px] w-auto h-auto text-white">water_drop</mat-icon>
                  </div>
                  <span>x2</span>
                </div>
              </div>
              <div class="flex flex-col items-center border-x border-gray-400/30">
                <span>Resistance</span>
                <span class="mt-1">-20</span>
              </div>
              <div class="flex flex-col items-center">
                <span>Retreat</span>
                <div class="flex space-x-0.5 mt-1">
                  @for (i of [].constructor(p.retreatCost || 1); track $index) {
                    <div class="w-3 h-3 rounded-full bg-gray-400"></div>
                  }
                </div>
              </div>
            </div>

            <!-- Flavor Text -->
            <div class="absolute bottom-4 left-4 right-4 text-[0.6rem] leading-tight text-gray-600 italic border-t border-gray-400 pt-2">
              {{ p.description }}
            </div>

            <!-- Card Info -->
            <div class="absolute bottom-1 right-4 text-[0.5rem] font-bold text-gray-500">
              Illus. Ken Sugimori  ©1995, 96, 98 Nintendo, Creatures, GAMEFREAK. ©1999 Wizards.
            </div>
          </div>

          <!-- Stats Radar (Extra) -->
          <div class="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white">
            <h3 class="text-sm font-bold uppercase tracking-widest mb-3 flex items-center">
              <mat-icon class="mr-2 text-yellow-400">analytics</mat-icon>
              Base Stats
            </h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="w-16 text-xs opacity-70">Attack</span>
                <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-red-500 transition-all duration-1000" [style.width.%]="(p.attack || 50) / 1.5"></div>
                </div>
                <span class="ml-3 text-xs font-mono">{{ p.attack }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-16 text-xs opacity-70">Defense</span>
                <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-500 transition-all duration-1000" [style.width.%]="(p.defense || 50) / 1.5"></div>
                </div>
                <span class="ml-3 text-xs font-mono">{{ p.defense }}</span>
              </div>
              <div class="flex items-center">
                <span class="w-16 text-xs opacity-70">Speed</span>
                <div class="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="h-full bg-yellow-500 transition-all duration-1000" [style.width.%]="(p.speed || 50) / 1.5"></div>
                </div>
                <span class="ml-3 text-xs font-mono">{{ p.speed }}</span>
              </div>
            </div>
          </div>

          <!-- Evolution Chain (Collapsible) -->
          <div class="mt-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white overflow-hidden">
            <button (click)="toggleEvolution()" 
                    class="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div class="flex items-center">
                <mat-icon class="mr-2 text-green-400">account_tree</mat-icon>
                <span class="text-sm font-bold uppercase tracking-widest">Evolution Chain</span>
              </div>
              <mat-icon [class.rotate-180]="isEvolutionExpanded()" class="transition-transform">expand_more</mat-icon>
            </button>
            
            @if (isEvolutionExpanded()) {
              <div class="p-4 pt-0 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                @if (isLoadingEvolution()) {
                  <div class="flex justify-center py-4">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                  </div>
                } @else if (evolutionChain(); as chain) {
                  <div class="flex flex-col items-center space-y-4 py-4">
                    <ng-container *ngTemplateOutlet="evolutionNode; context: { $implicit: chain }"></ng-container>
                  </div>
                } @else {
                  <p class="text-xs text-center py-4 opacity-50">No evolution data available.</p>
                }
              </div>
            }
          </div>

          <!-- Recursive Template for Evolution Nodes -->
          <ng-template #evolutionNode let-node>
            <div class="flex flex-col items-center">
              <div class="group relative flex flex-col items-center">
                <div class="w-24 h-24 rounded-full bg-white/20 p-3 border-2 border-white/30 group-hover:border-yellow-400 transition-colors shadow-inner">
                  <img [src]="node.image" [alt]="node.speciesName" class="w-full h-full object-contain drop-shadow-md">
                </div>
                <span class="text-xs font-black mt-2 uppercase tracking-tight text-white/90">{{ node.speciesName }}</span>
              </div>
              
              @if (node.evolvesTo.length > 0) {
                <div class="flex flex-col items-center mt-2">
                  <mat-icon class="text-white/30 text-xs h-auto w-auto">south</mat-icon>
                  <div class="flex flex-wrap justify-center gap-4 mt-2">
                    @for (subNode of node.evolvesTo; track subNode.speciesName) {
                      <ng-container *ngTemplateOutlet="evolutionNode; context: { $implicit: subNode }"></ng-container>
                    }
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </div>
      </div>
    }
  `,
  styles: [`
    .pokemon-card-tcg {
      background: linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 100%);
      box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 100px rgba(255,255,255,0.2);
    }

    /* Type Specific Card Backgrounds */
    .type-fire { background-color: #ffccbc; border-color: #ff5722; }
    .type-water { background-color: #bbdefb; border-color: #2196f3; }
    .type-grass { background-color: #c8e6c9; border-color: #4caf50; }
    .type-electric { background-color: #fff9c4; border-color: #ffeb3b; }
    .type-psychic { background-color: #f8bbd0; border-color: #e91e63; }
    .type-fighting { background-color: #d7ccc8; border-color: #795548; }
    .type-normal { background-color: #f5f5f5; border-color: #9e9e9e; }
  `],
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
