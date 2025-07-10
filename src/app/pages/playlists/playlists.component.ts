import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaylistsService } from '../../core/services/playlists/playlists.service';
import { Playlist } from '../../core/interfaces/playlist';


@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
  playlists: Playlist[] = [];
  loading = true;
  error: string | null = null;

  constructor(private playlistsService: PlaylistsService) {}

  ngOnInit() {
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.loading = true;
    this.error = null;
    
    this.playlistsService.getPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load playlists. Please try again later.';
        this.loading = false;
        console.error('Error loading playlists:', error);
      }
    });
  }

  getEpisodeCount(playlist: Playlist): number {
    return playlist.episodes?.length || 0;
  }

  getTotalDuration(playlist: Playlist): string {
    if (!playlist.episodes || playlist.episodes.length === 0) {
      return '0 min';
    }
    
    // This is a simplified calculation - in a real app you'd parse the duration strings
    const totalMinutes = playlist.episodes.length * 30; // Assuming average 30 min per episode
    return `${totalMinutes} min`;
  }
} 