import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PokemonService } from './services/pokemon.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50">
      <!-- Modern Colorful Header -->
      <header class="sticky top-0 z-[100] w-full">
        <!-- Gradient Top Bar -->
        <div class="h-1.5 w-full bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-600"></div>
        
        <!-- Main Header Navigation -->
        <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div class="container mx-auto px-4">
            <div class="flex h-20 items-center justify-between">
              
              <!-- Logo Section -->
              <div class="flex items-center space-x-4">
                <a routerLink="/" class="flex items-center space-x-4 group">
                  <div class="relative">
                    <div class="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 to-blue-600 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                    <div class="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-inner border-2 border-slate-100">
                      <div class="h-8 w-8 rounded-full border-4 border-slate-800 bg-blue-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                        <div class="h-2 w-2 rounded-full bg-white/40 ml-1 mt-1"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 class="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-2xl font-black tracking-tighter text-transparent uppercase">
                      PokéDex <span class="text-red-600">2000</span>
                    </h1>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">Ultimate Database</p>
                  </div>
                </a>
              </div>

              <!-- Desktop Menu -->
              <div class="hidden lg:flex items-center space-x-1">
                @for (item of menuItems; track item.label) {
                  <a [routerLink]="item.path" (click)="handleMenuClick(item.label)" 
                     class="group relative px-4 py-2 text-sm font-bold transition-all"
                     [class.text-slate-900]="isItemActive(item.label)"
                     [class.text-slate-600]="!isItemActive(item.label)">
                    <div class="flex items-center space-x-2">
                      <mat-icon class="text-lg transition-transform group-hover:scale-110" [style.color]="item.color">{{ item.icon }}</mat-icon>
                      <span>{{ item.label }}</span>
                      @if (item.label === 'Favorites' && pokemonService.favorites().length > 0) {
                        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm">
                          {{ pokemonService.favorites().length }}
                        </span>
                      }
                      @if (item.label === 'Compare' && pokemonService.comparisonList().length > 0) {
                        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white shadow-sm">
                          {{ pokemonService.comparisonList().length }}
                        </span>
                      }
                    </div>
                    <div class="absolute bottom-0 left-4 right-4 h-0.5 transition-transform duration-300"
                         [class.scale-x-100]="isItemActive(item.label)"
                         [class.scale-x-0]="!isItemActive(item.label)"
                         [style.backgroundImage]="'linear-gradient(to right, ' + item.color + ', transparent)'"></div>
                  </a>
                }
              </div>

              <!-- Action Buttons -->
              <div class="hidden md:flex items-center space-x-4">
                <button class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900">
                  <mat-icon>notifications</mat-icon>
                </button>
                <div class="h-8 w-px bg-slate-200"></div>
                <button class="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:scale-105 active:scale-95">
                  <mat-icon class="text-lg">account_circle</mat-icon>
                  <span>Sign In</span>
                </button>
              </div>

              <!-- Mobile Menu Toggle -->
              <button (click)="isMenuOpen.set(!isMenuOpen())" 
                      class="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 lg:hidden">
                <mat-icon>{{ isMenuOpen() ? 'close' : 'menu' }}</mat-icon>
              </button>
            </div>
          </div>

          <!-- Mobile Menu -->
          <div class="lg:hidden overflow-hidden transition-all duration-300 ease-in-out"
               [class.max-h-0]="!isMenuOpen()"
               [class.max-h-[70vh]]="isMenuOpen()">
            <div class="border-t border-slate-100 bg-slate-50/50 px-3 py-3 space-y-1 overflow-y-auto max-h-[70vh]">
              @for (item of menuItems; track item.label) {
                <a [routerLink]="item.path" (click)="handleMenuClick(item.label)" 
                   class="flex w-full items-center space-x-3 rounded-xl p-3 text-slate-600 transition-all hover:bg-white hover:shadow-sm hover:text-slate-900">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm" [style.backgroundColor]="item.color + '20'">
                    <mat-icon [style.color]="item.color" class="text-base h-4 w-4 flex items-center justify-center">{{ item.icon }}</mat-icon>
                  </div>
                  <span class="font-bold text-sm">{{ item.label }}</span>
                  @if (item.label === 'Favorites' && pokemonService.favorites().length > 0) {
                    <span class="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-bold text-white shadow-sm">
                      {{ pokemonService.favorites().length }}
                    </span>
                  }
                  @if (item.label === 'Compare' && pokemonService.comparisonList().length > 0) {
                    <span class="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[9px] font-bold text-white shadow-sm">
                      {{ pokemonService.comparisonList().length }}
                    </span>
                  }
                  <mat-icon class="ml-auto text-slate-300 text-sm h-4 w-4 flex items-center justify-center" [class.text-red-500]="isItemActive(item.label)">
                    {{ isItemActive(item.label) ? 'check_circle' : 'chevron_right' }}
                  </mat-icon>
                </a>
              }
            </div>
          </div>
        </nav>
      </header>
      
      <main class="relative">
        <!-- Decorative Background Elements -->
        <div class="absolute top-0 left-0 -z-10 h-[500px] w-full bg-gradient-to-b from-slate-200/50 to-transparent"></div>
        <div class="absolute top-40 right-0 -z-10 h-96 w-96 rounded-full bg-red-500/5 blur-[120px]"></div>
        <div class="absolute top-80 left-0 -z-10 h-96 w-96 rounded-full bg-blue-500/5 blur-[120px]"></div>

        <router-outlet></router-outlet>
      </main>
      
      <footer class="mt-20 border-t border-slate-200 bg-white py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div class="flex items-center space-x-3 mb-6">
                <div class="h-8 w-8 rounded-full bg-red-600"></div>
                <h3 class="text-xl font-black tracking-tighter text-slate-900">PokéDex 2000</h3>
              </div>
              <p class="text-slate-500 text-sm leading-relaxed">
                The most comprehensive offline Pokémon database. Explore, learn, and master the world of Pokémon.
              </p>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul class="space-y-4 text-sm text-slate-500">
                <li><a routerLink="/" (click)="handleMenuClick('Home')" class="hover:text-red-600 transition-colors">Home</a></li>
                <li><a routerLink="/" (click)="handleMenuClick('Favorites')" class="hover:text-red-600 transition-colors">My Favorites</a></li>
                <li><a routerLink="/quiz" (click)="handleMenuClick('Quiz')" class="hover:text-red-600 transition-colors">Pokémon Quiz</a></li>
                <li><a href="#" class="hover:text-red-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" class="hover:text-red-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Stay Connected</h4>
              <div class="flex space-x-4">
                @for (social of ['facebook', 'twitter', 'instagram']; track social) {
                  <a href="#" class="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                    <mat-icon class="text-lg">public</mat-icon>
                  </a>
                }
              </div>
            </div>
          </div>
          <div class="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <p>&copy; 2026 PokéDex 2000. All rights reserved.</p>
            <p>Data provided by PokeAPI (Offline Mode)</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class App {
  public pokemonService = inject(PokemonService);
  private router = inject(Router);
  isMenuOpen = signal(false);

  menuItems = [
    { label: 'Home', icon: 'home', color: '#ef4444', path: '/' },
    { label: 'Favorites', icon: 'favorite', color: '#ec4899', path: '/' },
    { label: 'Search', icon: 'search', color: '#3b82f6', path: '/search' },
    { label: 'Compare', icon: 'compare_arrows', color: '#8b5cf6', path: '/compare' },
    { label: 'Quiz', icon: 'quiz', color: '#eab308', path: '/quiz' },
    { label: 'About', icon: 'info', color: '#22c55e', path: '/about' },
    { label: 'Info', icon: 'info', color: '#2b9bc7', path: '/info' }
  ];

  handleMenuClick(label: string) {
    if (label === 'Favorites') {
      this.pokemonService.resetFilters();
      this.pokemonService.showFavoritesOnly.set(true);
    } else if (label === 'Home') {
      this.pokemonService.resetFilters();
      this.pokemonService.showFavoritesOnly.set(false);
    } else {
      this.pokemonService.showFavoritesOnly.set(false);
    }
    this.isMenuOpen.set(false);
  }

  isItemActive(label: string): boolean {
    const currentUrl = this.router.url;
    if (label === 'Quiz') return currentUrl.includes('/quiz');
    if (label === 'Search') return currentUrl.includes('/search');
    if (label === 'Compare') return currentUrl.includes('/compare');
    if (label === 'Info') return currentUrl.includes('/info');
    if (label === 'About') return currentUrl.includes('/about');
    if (label === 'Favorites') return currentUrl === '/' && this.pokemonService.showFavoritesOnly();
    if (label === 'Home') return currentUrl === '/' && !this.pokemonService.showFavoritesOnly();
    return false;
  }
}
