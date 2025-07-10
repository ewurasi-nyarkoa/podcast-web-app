import { Component, OnInit } from '@angular/core';
import { EpisodesService } from '../core/services/episodes/episodes.service';
import { EpisodesResponse } from '../core/interfaces/episodes';
import { RouterModule } from '@angular/router';
import { AudioPlayerService } from '../core/services/audio-player/audio-player.service';
import { Episode } from '../core/interfaces/episodes';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-episodes-list',
  standalone: true,
  imports: [RouterModule, CommonModule, PaginationComponent],
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.scss']
})
export class EpisodesListComponent implements OnInit {
  episodesResponse?: EpisodesResponse;
  currentPage = 1;
  isPlaying = false;
  currentEpisodeId: number | null = null;

  constructor(
    private episodesService: EpisodesService,
    public audioPlayerService: AudioPlayerService
  ) {}

  ngOnInit() {
    this.fetchEpisodes(this.currentPage);
    this.audioPlayerService.isPlaying$.subscribe(isPlaying => this.isPlaying = isPlaying);
    this.audioPlayerService.currentEpisode$.subscribe(episode => this.currentEpisodeId = episode?.id ?? null);
  }

  fetchEpisodes(page: number) {
    this.episodesService.getEpisodes(page).subscribe(response => {
      this.episodesResponse = response;
      this.currentPage = response.meta.page;
    });
  }

  onPageChange(newPage: number) {
    this.fetchEpisodes(newPage);
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
