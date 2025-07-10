import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { EpisodesListComponent } from './episodes-list/episodes-list.component';
import { EpisodeDetailsComponent } from './episode-details/episode-details.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'episodes', component: EpisodesListComponent },
  { path: 'episodes/:id', component: EpisodeDetailsComponent },
];
