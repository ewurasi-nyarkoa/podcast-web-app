import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamDisplayComponent } from '../../shared/components/team-display/team-display.component';
import { EpisodesService } from '../../core/services/episodes/episodes.service';
import { AudioPlayerService } from '../../core/services/audio-player/audio-player.service';
import { Episode } from '../../core/interfaces/episodes';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    TeamDisplayComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  latestEpisodes: Episode[] = [];
  isPlaying = false;
  currentEpisodeId: number | null = null;

  constructor(
    private episodesService: EpisodesService,
    public audioPlayerService: AudioPlayerService
  ) {}

  ngOnInit() {
    this.fetchLatestEpisodes();
    this.audioPlayerService.isPlaying$.subscribe(isPlaying => this.isPlaying = isPlaying);
    this.audioPlayerService.currentEpisode$.subscribe(episode => this.currentEpisodeId = episode?.id ?? null);
  }

  fetchLatestEpisodes() {
    // Use getAllEpisodes to get all episodes, then sort by date to get the latest
    this.episodesService.getAllEpisodes().subscribe(allEpisodes => {
      // Sort episodes by posted_on date (newest first), fallback to created_at if posted_on is not available
      const sortedEpisodes = allEpisodes.sort((a, b) => {
        const dateA = a.posted_on || a.created_at;
        const dateB = b.posted_on || b.created_at;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
      
      // Take the first 5 episodes (the latest ones)
      this.latestEpisodes = sortedEpisodes.slice(0, 5);
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
}