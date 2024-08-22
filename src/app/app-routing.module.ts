import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'log-in',
    pathMatch: 'full'
  },
  {
    path: 'explore',
    loadChildren: () => import('./explore/explore.module').then(m => m.ExplorePageModule),
  },
  {
    path: 'watchlist',
    loadChildren: () => import('./watchlist/watchlist.module').then(m => m.WatchlistPageModule),
  },
  {
    path: 'explore/anime-details/:id',
    loadChildren: () => import('./anime-details/anime-details.module').then(m => m.AnimeDetailsPageModule),
  },
  {
    path: 'search/anime-details/:id',
    loadChildren: () => import('./anime-details/anime-details.module').then(m => m.AnimeDetailsPageModule),
  },
  {
    path: 'watchlist/anime-details/:id',
    loadChildren: () => import('./anime-details/anime-details.module').then(m => m.AnimeDetailsPageModule),
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
  },  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
