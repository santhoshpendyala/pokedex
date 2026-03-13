import {Routes} from '@angular/router';
import {PokemonListComponent} from './components/pokemon-list/pokemon-list.component';

export const routes: Routes = [
  {path: '', component: PokemonListComponent},
  {path: 'search', loadComponent: () => import('./components/pokemon-search/pokemon-search.component').then(m => m.PokemonSearchComponent)},
  {path: 'quiz', loadComponent: () => import('./components/pokemon-quiz/pokemon-quiz.component').then(m => m.PokemonQuizComponent)},
  {path: 'compare', loadComponent: () => import('./components/pokemon-compare/pokemon-compare.component').then(m => m.PokemonCompareComponent)},
  {path: '**', redirectTo: ''}
];
