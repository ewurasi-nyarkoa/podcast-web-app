import { Component, OnInit } from '@angular/core';
import { EpisodesService } from '../core/services/episodes/episodes.service';
import { Episode } from '../core/interfaces/episodes';
import { RouterModule } from '@angular/router';
import { AudioPlayerService } from '../core/services/audio-player/audio-player.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [RouterModule, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  latestEpisodes: Episode[] = [];
  isPlaying = false;
  currentEpisodeId: number | null = null;

  constructor(private episodesService: EpisodesService, public audioPlayerService: AudioPlayerService) {}

  ngOnInit() {
    this.episodesService.getEpisodes(1).subscribe(response => {
      this.latestEpisodes = response.data.slice(0, 5); // Show up to 5 latest episodes
    });
    this.audioPlayerService.isPlaying$.subscribe(isPlaying => this.isPlaying = isPlaying);
    this.audioPlayerService.currentEpisode$.subscribe(episode => this.currentEpisodeId = episode?.id ?? null);
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
