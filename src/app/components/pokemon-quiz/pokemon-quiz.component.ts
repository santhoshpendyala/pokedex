import { Component, inject, signal, effect, PLATFORM_ID, untracked } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-pokemon-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Quiz Header -->
      <div class="mb-8 text-center">
        <h2 class="text-4xl font-black tracking-tighter text-slate-900 uppercase">
          Who's That <span class="text-red-600">Pokémon?</span>
        </h2>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">Test your knowledge and earn points!</p>
      </div>

      <!-- Score Board -->
      <div class="flex justify-between items-center bg-white rounded-2xl p-6 shadow-xl border border-slate-100 mb-8">
        <div class="flex items-center space-x-4">
          <div class="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
            <mat-icon>emoji_events</mat-icon>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Score</p>
            <p class="text-2xl font-black text-slate-900">{{ score() }} <span class="text-sm font-bold text-slate-400">PTS</span></p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <mat-icon>timer</mat-icon>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Streak</p>
            <p class="text-2xl font-black text-slate-900">{{ streak() }}</p>
          </div>
        </div>
      </div>

      <!-- Quiz Card -->
      <div class="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        <!-- Background Decoration -->
        <div class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-slate-50"></div>
        
        @if (currentPokemon()) {
          <div class="relative z-10 flex flex-col items-center">
            <!-- Pokemon Image (Shadow) -->
            <div class="relative group mb-8">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100/50 rounded-full blur-2xl"></div>
              <img [src]="currentPokemon()?.image" 
                   [alt]="currentPokemon()?.name"
                   class="h-64 w-64 object-contain transition-all duration-700 ease-in-out transform"
                   [class.brightness-0]="!isRevealed()"
                   [class.scale-110]="isRevealed()"
                   referrerpolicy="no-referrer">
              
              @if (isRevealed()) {
                <div class="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                  <mat-icon>check</mat-icon>
                </div>
              }
            </div>

            <!-- Hints Section -->
            <div class="w-full space-y-4 mb-8">
              @if (showDescriptionHint()) {
                <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description Hint</p>
                  <p class="text-slate-600 text-sm italic leading-relaxed">
                    "{{ getMaskedDescription() }}"
                  </p>
                </div>
              }

              @if (showLetterHint()) {
                <div class="flex justify-center space-x-2 animate-in fade-in zoom-in duration-500">
                  @for (char of getMaskedName(); track $index) {
                    <div class="h-10 w-8 rounded-lg border-2 border-slate-200 flex items-center justify-center font-black text-slate-900 uppercase"
                         [class.bg-slate-50]="char === '_'"
                         [class.border-blue-500]="char !== '_'">
                      {{ char }}
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Input Section -->
            @if (!isRevealed()) {
              <div class="w-full space-y-4">
                <div class="relative">
                  <input type="text" 
                         [(ngModel)]="userGuess"
                         (keyup.enter)="checkAnswer()"
                         placeholder="Who's that Pokémon?"
                         class="w-full bg-slate-100 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-6 py-4 text-lg font-bold text-slate-900 transition-all outline-none placeholder:text-slate-400">
                  <button (click)="checkAnswer()"
                          class="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                    GUESS
                  </button>
                </div>

                <div class="flex justify-center space-x-4">
                  <button (click)="toggleDescriptionHint()" 
                          [disabled]="showDescriptionHint()"
                          class="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors disabled:opacity-50">
                    <mat-icon class="text-sm">lightbulb</mat-icon>
                    <span>Description Hint</span>
                  </button>
                  <div class="w-px h-4 bg-slate-200"></div>
                  <button (click)="toggleLetterHint()"
                          [disabled]="showLetterHint()"
                          class="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors disabled:opacity-50">
                    <mat-icon class="text-sm">spellcheck</mat-icon>
                    <span>First Letter</span>
                  </button>
                </div>
              </div>
            } @else {
              <div class="w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div>
                  <h3 class="text-3xl font-black text-slate-900 uppercase tracking-tighter">It's {{ currentPokemon()?.name }}!</h3>
                  <div class="flex justify-center space-x-2 mt-2">
                    @for (type of currentPokemon()?.types; track type) {
                      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                            [style.backgroundColor]="getTypeColor(type)">
                        {{ type }}
                      </span>
                    }
                  </div>
                </div>
                
                <button (click)="nextPokemon()"
                        class="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all">
                  Next Pokémon
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-20">
            <div class="h-16 w-16 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Pokémon...</p>
          </div>
        }
      </div>

      <!-- Feedback Toast -->
      @if (feedback()) {
        <div class="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl font-bold text-white animate-in slide-in-from-bottom-8 duration-300 z-50"
             [class.bg-green-500]="feedback() === 'correct'"
             [class.bg-red-500]="feedback() === 'wrong'">
          {{ feedback() === 'correct' ? '+100 PTS! Correct!' : 'Try again!' }}
        </div>
      }

      <!-- Celebration Popup -->
      @if (showCelebration()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
            <div class="h-20 w-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <mat-icon class="text-4xl h-10 w-10">auto_awesome</mat-icon>
            </div>
            <h3 class="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Incredible!</h3>
            <p class="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">You've reached {{ score() }} points!</p>
            <button (click)="showCelebration.set(false)"
                    class="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
              Keep Going
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .brightness-0 {
      filter: brightness(0);
    }
  `]
})
export class PokemonQuizComponent {
  private pokemonService = inject(PokemonService);
  private platformId = inject(PLATFORM_ID);
  
  currentPokemon = signal<Pokemon | null>(null);
  score = signal(0);
  streak = signal(0);
  userGuess = '';
  isRevealed = signal(false);
  showDescriptionHint = signal(false);
  showLetterHint = signal(false);
  feedback = signal<'correct' | 'wrong' | null>(null);
  showCelebration = signal(false);
  private lastMilestone = 0;

  constructor() {
    // Load saved score and streak
    if (isPlatformBrowser(this.platformId)) {
      const savedScore = localStorage.getItem('pokemon_quiz_score');
      const savedStreak = localStorage.getItem('pokemon_quiz_streak');
      if (savedScore) {
        const scoreVal = parseInt(savedScore, 10);
        this.score.set(scoreVal);
        this.lastMilestone = Math.floor(scoreVal / 500) * 500;
      }
      if (savedStreak) this.streak.set(parseInt(savedStreak, 10));
    }

    effect(() => {
      const all = this.pokemonService.allPokemon();
      if (all.length > 0 && !this.currentPokemon()) {
        this.nextPokemon();
      }
    });

    // Save score and streak on change
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('pokemon_quiz_score', this.score().toString());
        localStorage.setItem('pokemon_quiz_streak', this.streak().toString());
      }
    });

    // Celebration effect
    effect(() => {
      const currentScore = this.score();
      if (currentScore > 0 && currentScore % 500 === 0 && currentScore > this.lastMilestone) {
        untracked(() => {
          this.triggerCelebration();
          this.lastMilestone = currentScore;
        });
      }
    });
  }

  triggerCelebration() {
    this.showCelebration.set(true);
    
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }

  nextPokemon() {
    const all = this.pokemonService.allPokemon();
    if (all.length === 0) return;

    const randomIndex = Math.floor(Math.random() * all.length);
    this.currentPokemon.set(all[randomIndex]);
    this.userGuess = '';
    this.isRevealed.set(false);
    this.showDescriptionHint.set(false);
    this.showLetterHint.set(false);
    this.feedback.set(null);
  }

  checkAnswer() {
    if (!this.userGuess.trim() || this.isRevealed()) return;

    const correctName = this.currentPokemon()?.name.toLowerCase() || '';
    const guess = this.userGuess.trim().toLowerCase();

    if (guess === correctName) {
      this.score.update(s => s + 100);
      this.streak.update(s => s + 1);
      this.isRevealed.set(true);
      this.showFeedback('correct');
    } else {
      this.streak.set(0);
      this.showFeedback('wrong');
    }
  }

  showFeedback(type: 'correct' | 'wrong') {
    this.feedback.set(type);
    setTimeout(() => {
      this.feedback.set(null);
    }, 2000);
  }

  toggleDescriptionHint() {
    this.showDescriptionHint.set(true);
  }

  toggleLetterHint() {
    this.showLetterHint.set(true);
  }

  getMaskedDescription(): string {
    const pokemon = this.currentPokemon();
    if (!pokemon) return '';
    
    // Replace the pokemon name in the description with "This Pokémon"
    const nameRegex = new RegExp(pokemon.name, 'gi');
    return pokemon.description.replace(nameRegex, 'This Pokémon');
  }

  getMaskedName(): string[] {
    const pokemon = this.currentPokemon();
    if (!pokemon) return [];

    const name = pokemon.name;
    const masked = name.split('').map((char, index) => {
      if (index === 0) return char;
      if (char === ' ' || char === '-' || char === '.') return char;
      return '_';
    });
    return masked;
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'Normal': '#94a3b8',
      'Fire': '#ef4444',
      'Water': '#3b82f6',
      'Grass': '#22c55e',
      'Electric': '#eab308',
      'Ice': '#06b6d4',
      'Fighting': '#b91c1c',
      'Poison': '#a855f7',
      'Ground': '#78350f',
      'Flying': '#818cf8',
      'Psychic': '#ec4899',
      'Bug': '#84cc16',
      'Rock': '#44403c',
      'Ghost': '#4c1d95',
      'Dragon': '#4338ca',
      'Steel': '#475569',
      'Dark': '#1e293b',
      'Fairy': '#f472b6'
    };
    return colors[type] || '#94a3b8';
  }
}
