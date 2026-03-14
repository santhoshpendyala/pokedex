import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-5xl">
      <!-- Title Section -->
      <div class="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 class="text-4xl font-black tracking-tighter text-slate-900 uppercase">
          Meet the <span class="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Creators</span>
        </h2>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">The story behind PokéDex 2000</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <!-- Image Section -->
        <div class="relative group animate-in fade-in slide-in-from-left-8 duration-700">
          <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-600 opacity-20 blur-xl group-hover:opacity-40 transitionduration-1000"></div>
          <div class="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white aspect-[2/4] flex items-center justify-center">
            <img src="/assets/images/we_3.jpeg" 
                 alt="Santhosh, Aahil, and Aarya Pendyala" 
                 class="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                 onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'; this.classList.remove('object-cover'); this.classList.add('object-contain', 'p-12', 'opacity-50');">
            
            <!-- Floating Decorative Badges -->
            <div class="absolute -bottom-6 -left-6 bg-white rounded-full p-2 shadow-xl border-4 border-slate-50 rotate-[-12deg] group-hover:rotate-0 transition-transform">
              <div class="bg-blue-100 text-blue-600 h-12 w-12 rounded-full flex items-center justify-center">
                <mat-icon>auto_awesome</mat-icon>
              </div>
            </div>
            
            <div class="absolute -top-6 -right-6 bg-white rounded-full p-2 shadow-xl border-4 border-slate-50 rotate-[12deg] group-hover:rotate-0 transition-transform">
              <div class="bg-red-100 text-red-600 h-12 w-12 rounded-full flex items-center justify-center">
                <mat-icon>favorite</mat-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Story Content Section -->
        <div class="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
          <div class="inline-flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full">
            <mat-icon class="text-orange-500 text-sm">auto_stories</mat-icon>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-600">Our Story</span>
          </div>
          
          <h3 class="text-3xl font-black text-slate-900 leading-tight">
            Built by a Dad for his two little Pokémon Masters! 🧢
          </h3>
          
          <div class="space-y-4 text-slate-600 text-lg leading-relaxed font-medium">
            <p>
              It all started with two amazing kids, a boy named <b>Aahil Pendyala</b> and his younger sister, <b>Aarya Pendyala</b>. Like many kids their age, Aahil and little Aarya absolutely <i>love</i> playing with Pokémon cards, battling their favorite creatures, and talking about who's the strongest.
            </p>
            <p>
              But there was one tiny problem: whenever they pulled a new cool-looking holographic card out of a booster pack, they always had tons of questions! 
              <span class="italic text-slate-500 block mt-2 border-l-4 border-blue-400 pl-4 bg-slate-50 py-2 pb-2 rounded-r-lg">
                "Dad, what element is this Pokémon weak to?<br/>Is Charizard really faster than Mewtwo?<br/>What exactly does this weird ability do?"
              </span>
            </p>
            <p>
              Flipping through manuals or searching random websites was taking way too long and ruining the fun of the game. They needed a lightning-fast, super-cool tool to quickly lookup any details they ever needed.
            </p>
            <p>
              So, I, <b>Santhosh Kumar Pendyala</b>, their dad (and arguably their biggest fan), decided to build them this app! The <b>PokéDex 2000</b> was created so my kids—and players everywhere—can quickly check stats, compare their favorite cards, and become the ultimate Pokémon Masters!
            </p>
          </div>
          
          <div class="pt-6 border-t border-slate-100 flex items-center space-x-4">
            <a routerLink="/search" class="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 text-center flex items-center justify-center space-x-2">
              <mat-icon>search</mat-icon>
              <span>Back to Searching</span>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Kids Features Highlight -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div class="bg-blue-50 rounded-3xl p-8 border border-blue-100 text-center hover:shadow-xl hover:scale-105 transition-all">
          <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-3xl">child_care</mat-icon>
          </div>
          <h4 class="font-black text-slate-900 text-lg mb-2">Kid Friendly ✨</h4>
          <p class="text-slate-600 text-sm">Designed specifically to be super easy to use for Aahil, Aarya, and friends!</p>
        </div>
        
        <div class="bg-red-50 rounded-3xl p-8 border border-red-100 text-center hover:shadow-xl hover:scale-105 transition-all">
          <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-3xl">flash_on</mat-icon>
          </div>
          <h4 class="font-black text-slate-900 text-lg mb-2">Lightning Fast ⚡</h4>
          <p class="text-slate-600 text-sm">No waiting! Find the stats you need to win your card battles instantly.</p>
        </div>
        
        <div class="bg-purple-50 rounded-3xl p-8 border border-purple-100 text-center hover:shadow-xl hover:scale-105 transition-all">
          <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-3xl">sports_esports</mat-icon>
          </div>
          <h4 class="font-black text-slate-900 text-lg mb-2">Built With Love ❤️</h4>
          <p class="text-slate-600 text-sm">Coded by Dad with love, to help build the best Pokémon teams ever.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AboutComponent { }
