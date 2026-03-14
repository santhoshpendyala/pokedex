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
  templateUrl: './pokemon-quiz.component.html',
  styleUrl: './pokemon-quiz.component.css'
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
