import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PlaylistsService } from '../../core/services/playlists/playlists.service';
import { AudioPlayerService } from '../../core/services/audio-player/audio-player.service';
import { Playlist } from '../../core/interfaces/playlist';
import { Episode } from '../../core/interfaces/episodes';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {
  playlist?: Playlist;
  loading = true;
  error: string | null = null;
  isPlaying = false;
  currentEpisodeId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistsService: PlaylistsService,
    public audioPlayerService: AudioPlayerService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const playlistId = params['id'];
      if (playlistId) {
        this.loadPlaylist(playlistId);
      }
    });

    this.audioPlayerService.isPlaying$.subscribe(isPlaying => this.isPlaying = isPlaying);
    this.audioPlayerService.currentEpisode$.subscribe(episode => this.currentEpisodeId = episode?.id ?? null);
  }

  loadPlaylist(id: string) {
    this.loading = true;
    this.error = null;

    this.playlistsService.getPlaylist(+id).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load playlist. Please try again later.';
        this.loading = false;
        console.error('Error loading playlist:', error);
      }
    });
  }

  isCurrentEpisodePlaying(episode: Episode): boolean {
    return this.currentEpisodeId === episode.id && this.isPlaying;
  }

  togglePlayPause(episode: Episode) {
    if (this.currentEpisodeId !== episode.id) {
      this.audioPlayerService.setEpisode(episode, true);
    } else {
      this.audioPlayerService.togglePlayPause();
    }
  }

  playPlaylist() {
    if (this.playlist && this.playlist.episodes.length > 0) {
      // Start playing the first episode in the playlist
      this.audioPlayerService.setEpisode(this.playlist.episodes[0], true);
    }
  }

  getTotalDuration(): string {
    if (!this.playlist || !this.playlist.episodes) {
      return '0 min';
    }
    
    // Simplified calculation - in a real app you'd parse the duration strings
    const totalMinutes = this.playlist.episodes.length * 30; // Assuming average 30 min per episode
    return `${totalMinutes} min`;
  }

  goBack() {
    this.router.navigate(['/playlists']);
  }
} 