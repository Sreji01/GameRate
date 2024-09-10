import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'log-in',
    pathMatch: 'full'
  },
  {
    path: 'explore',
    loadChildren: () => import('./explore/explore.module').then(m => m.ExplorePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'watchlist',
    loadChildren: () => import('./watchlist/watchlist.module').then(m => m.WatchlistPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'explore/game-details/:id',
    loadChildren: () => import('./game-details/game-details.module').then(m => m.AnimeDetailsPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'search/game-details/:id',
    loadChildren: () => import('./game-details/game-details.module').then(m => m.AnimeDetailsPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'watchlist/game-details/:id',
    loadChildren: () => import('./game-details/game-details.module').then(m => m.AnimeDetailsPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'log-in',
    loadChildren: () => import('./auth/log-in/log-in.module').then(m => m.LogInPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [authGuard]
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
