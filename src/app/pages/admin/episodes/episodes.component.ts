import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EpisodeService } from '../../../core/services/episodes.service';
import { OnInit } from '@angular/core';
import { map, catchError, startWith, finalize } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.scss'
})
export class EpisodesComponent implements OnInit {
  private episodeService = inject(EpisodeService);
  loading = true;
  error: string | null = null;
  episodes$ = this.episodeService.episodes$.pipe(
    map(episodes => episodes.slice(0, 10)),
    catchError(error => {
      this.error = 'Failed to load episodes. Please try again.';
      console.error('Error loading episodes:', error);
      return of([]);
    })
  );
  
  // Audio playback state
  currentAudio: HTMLAudioElement | null = null;
  playingEpisodeId: number | null = null;
  
  ngOnInit(): void {
    this.loadEpisodes();
  }
  
  loadEpisodes(): void {
    this.loading = true;
    this.error = null;
    
    this.episodeService.getEpisodes().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: () => {
        // Episodes loaded successfully
      },
      error: (error) => {
        this.error = 'Failed to load episodes. Please try again.';
        console.error('Error loading episodes:', error);
      }
    });
  }
  
  retryLoad(): void {
    this.loadEpisodes();
  }
  
  // Audio controls
  playPauseAudio(audioUrl: string, episodeId: number) {
    // If already playing this episode, toggle pause/play
    if (this.playingEpisodeId === episodeId && this.currentAudio) {
      if (this.currentAudio.paused) {
        this.currentAudio.play();
      } else {
        this.currentAudio.pause();
      }
      return;
    }
    
    // Pause previous audio if any
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    
    // Create new audio and play
    const audio = new Audio(audioUrl);
    audio.play();
    this.currentAudio = audio;
    this.playingEpisodeId = episodeId;
    
    // Reset state when audio ends
    audio.onended = () => {
      this.playingEpisodeId = null;
      this.currentAudio = null;
    };
  }
  
  isPlaying(episodeId: number): boolean {
    return this.playingEpisodeId === episodeId && !!this.currentAudio && this.currentAudio.paused === false;
  }
}