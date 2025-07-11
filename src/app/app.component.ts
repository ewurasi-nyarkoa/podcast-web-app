import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/layout/header.component';
import { FooterComponent } from './shared/components/layout/footer.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, AudioPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'podcast-web-app';
  is404Page = false;

  constructor(public router: Router) {
    // Listen to route changes to detect 404 page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if current route is not in our defined routes
      const validRoutes = ['', '/episodes', '/playlists', '/team', '/confessions', '/admin'];
      const currentPath = this.router.url.split('?')[0]; // Remove query params
      this.is404Page = !validRoutes.some(route => currentPath.startsWith(route));
    });
  }

  get showHeaderFooter(): boolean {
    // Hide header/footer on admin pages and 404 page
    return !this.router.url.startsWith('/admin') && !this.is404Page;
  }
}
