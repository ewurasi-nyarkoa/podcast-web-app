import { Component, OnInit } from '@angular/core';
import { AudioPlayerService } from '../core/services/audio-player/audio-player.service';
import { EpisodesService } from '../core/services/episodes/episodes.service';
import { Episode } from '../core/interfaces/episodes';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  imports: [AsyncPipe, CommonModule]
})
export class AudioPlayerComponent implements OnInit {
  currentEpisode$: Observable<Episode | null>;
  isPlaying$: Observable<boolean>;
  currentTime$: Observable<number>;
  duration$: Observable<number>;
  showPlayer = true;
  userClosed = false;

  constructor(
    public audioPlayerService: AudioPlayerService,
    private episodesService: EpisodesService
  ) {
    this.currentEpisode$ = this.audioPlayerService.currentEpisode$;
    this.isPlaying$ = this.audioPlayerService.isPlaying$;
    this.currentTime$ = this.audioPlayerService.currentTime$;
    this.duration$ = this.audioPlayerService.duration$;
  }

  ngOnInit() {
    this.currentEpisode$.subscribe(episode => {
      if (!episode) {
        if (!this.userClosed) {
          this.episodesService.getEpisodes(1).subscribe(response => {
            if (response.data.length > 0) {
              this.audioPlayerService.setEpisode(response.data[0], false);
              this.showPlayer = true;
            } else {
              this.showPlayer = false;
            }
          });
        } else {
          this.showPlayer = false;
        }
      } else {
        this.showPlayer = true;
      }
    });
  }

  play() {
    this.audioPlayerService.play();
  }

  pause() {
    this.audioPlayerService.pause();
  }

  togglePlayPause() {
    this.audioPlayerService.togglePlayPause();
  }

  seekFromInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      this.audioPlayerService.seek(Number(input.value));
    }
  }

  cancel() {
    this.audioPlayerService.cancel();
    this.showPlayer = false;
    this.userClosed = true;
  }

  formatTime(seconds: number): string {
    return this.audioPlayerService.formatTime(seconds);
  }
}
