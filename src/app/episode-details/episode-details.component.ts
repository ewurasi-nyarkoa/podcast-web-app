import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EpisodesService } from '../core/services/episodes/episodes.service';
import { AudioPlayerService } from '../core/services/audio-player/audio-player.service';
import { Episode } from '../core/interfaces/episodes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-episode-details',
  imports: [CommonModule],
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

  constructor(
    private route: ActivatedRoute,
    private episodesService: EpisodesService,
    public audioPlayerService: AudioPlayerService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.episodesService.getEpisodes(1).subscribe(response => {
        this.episode = response.data.find(e => e.id == +id);
        this.loading = false;
        if (!this.episode) {
          this.error = 'Episode not found.';
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
}
