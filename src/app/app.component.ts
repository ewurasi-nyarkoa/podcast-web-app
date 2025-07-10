
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  constructor(public router: Router) {}

  get showHeaderFooter(): boolean {
    return !this.router.url.startsWith('/admin');
  }
}
