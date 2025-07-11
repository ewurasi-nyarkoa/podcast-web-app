import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-resource-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './resource-not-found.component.html',
  styleUrl: './resource-not-found.component.scss'
})
export class ResourceNotFoundComponent {
  @Input() resourceType: 'episode' | 'playlist' | 'confession' | 'team member' = 'episode';
  @Input() resourceId?: string | number;
  @Input() showBackButton = true;
  @Input() customMessage?: string;

  goBack() {
    window.history.back();  
    }

  get defaultMessage(): string {
    const type = this.resourceType.charAt(0).toUpperCase() + this.resourceType.slice(1);
    const idText = this.resourceId ? ` with ID ${this.resourceId}` : '';
    return `${type}${idText} not found. It may have been deleted or moved.`;
  }

  get message(): string {
    return this.customMessage || this.defaultMessage;
  }

  get suggestions(): string[] {
    switch (this.resourceType) {
      case 'episode':
        return [
          'Check if the episode ID is correct',
          'Browse our latest episodes',
          'Search for similar content',
          'Check if the episode was moved to a different season'
        ];
      case 'playlist':
        return [
          'Check if the playlist ID is correct',
          'Browse our available playlists',
          'Create a new playlist',
          'Check if the playlist was deleted'
        ];
      case 'confession':
        return [
          'Check if the confession ID is correct',
          'Submit a new confession',
          'Browse recent confessions',
          'Check if the confession was removed'
        ];
      case 'team member':
        return [
          'Check if the team member ID is correct',
          'Meet our current team',
          'Check if the team member left',
          'Contact us for more information'
        ];
      default:
        return [
          'Check if the ID is correct',
          'Browse our available content',
          'Go back to the previous page',
          'Contact us for assistance'
        ];
    }
  }

  get primaryActionRoute(): string {
    switch (this.resourceType) {
      case 'episode':
        return '/episodes';
      case 'playlist':
        return '/playlists';
      case 'confession':
        return '/confessions';
      case 'team member':
        return '/team';
      default:
        return '/';
    }
  }

  get primaryActionText(): string {
    switch (this.resourceType) {
      case 'episode':
        return 'Browse Episodes';
      case 'playlist':
        return 'Browse Playlists';
      case 'confession':
        return 'Submit Confession';
      case 'team member':
        return 'Meet the Team';
      default:
        return 'Go Home';
    }
  }

  get primaryActionIcon(): string {
    switch (this.resourceType) {
      case 'episode':
        return 'headphones';
      case 'playlist':
        return 'playlist_play';
      case 'confession':
        return 'message';
      case 'team member':
        return 'group';
      default:
        return 'home';
    }
  }
} 