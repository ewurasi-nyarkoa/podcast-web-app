import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EpisodesService } from '../core/services/episodes/episodes.service';
import { PlaylistsService } from '../core/services/playlists/playlists.service';
import { AudioPlayerService } from '../core/services/audio-player/audio-player.service';
import { Episode } from '../core/interfaces/episodes';
import { Playlist } from '../core/interfaces/playlist';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResourceNotFoundComponent } from '../shared/components/resource-not-found/resource-not-found.component';

@Component({
  selector: 'app-episode-details',
  imports: [CommonModule, RouterModule, ResourceNotFoundComponent],
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.scss']
})
export class EpisodeDetailsComponent implements OnInit {
  episode?: Episode;
  loading = true;
  error: string | null = null;
  currentTime = 0;
  duration = 0;
  isPlaying = false;
  currentEpisodeId: number | null = null;
  playlists: Playlist[] = [];
  playlistsLoading = false;
  episodeId?: string;

  constructor(
    private route: ActivatedRoute,
    private episodesService: EpisodesService,
    private playlistsService: PlaylistsService,
    public audioPlayerService: AudioPlayerService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.episodeId = id || undefined;
    
    if (id) {
      this.episodesService.getEpisodes(1).subscribe(response => {
        this.episode = response.data.find(e => e.id == +id);
        this.loading = false;
        if (!this.episode) {
          this.error = 'Episode not found.';
        } else {
          this.loadPlaylistsForEpisode();
        }
      }, err => {
        this.error = 'Failed to load episode.';
        this.loading = false;
      });
    } else {
      this.error = 'Invalid episode ID.';
      this.loading = false;
    }
    this.audioPlayerService.currentTime$.subscribe(time => this.currentTime = time);
    this.audioPlayerService.duration$.subscribe(dur => this.duration = dur);
    this.audioPlayerService.isPlaying$.subscribe(isPlaying => this.isPlaying = isPlaying);
    this.audioPlayerService.currentEpisode$.subscribe(episode => this.currentEpisodeId = episode?.id ?? null);
  }

  isCurrentEpisode(): boolean {
    return !!this.episode && this.currentEpisodeId === this.episode.id;
  }

  isCurrentEpisodePlaying(): boolean {
    return this.isCurrentEpisode() && this.isPlaying;
  }

  togglePlayPause() {
    if (!this.episode) return;
    if (!this.isCurrentEpisode()) {
      this.audioPlayerService.setEpisode(this.episode, true);
    } else {
      this.audioPlayerService.togglePlayPause();
    }
  }

  seekFromInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      this.audioPlayerService.seek(Number(input.value));
    }
  }

  formatTime(seconds: number): string {
    return this.audioPlayerService.formatTime(seconds);
  }

  private loadPlaylistsForEpisode() {
    if (!this.episode) return;
    
    this.playlistsLoading = true;
    this.playlistsService.getPlaylists().subscribe({
      next: (allPlaylists) => {
        // Filter playlists that contain this episode
        this.playlists = allPlaylists.filter(playlist => 
          playlist.episodes?.some(ep => ep.id === this.episode?.id)
        );
        this.playlistsLoading = false;
      },
      error: (error) => {
        console.error('Error loading playlists for episode:', error);
        this.playlistsLoading = false;
      }
    });
  }
}
