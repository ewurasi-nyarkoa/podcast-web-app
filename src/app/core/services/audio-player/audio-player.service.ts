import { Injectable } from '@angular/core';
import { Episode } from '../../interfaces/episodes';
import { BehaviorSubject, distinctUntilChanged, fromEvent, takeUntil, Subject, Observable, throwError } from 'rxjs';
import { PlayerState } from '../../interfaces/player-state';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audio = new Audio();
  private readonly PLAYER_STATE_KEY = 'podcast_player_state';

  private currentEpisodeSubject = new BehaviorSubject<Episode | null>(null);
  currentEpisode$ = this.currentEpisodeSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  private destroy$ = new Subject<void>();

  constructor() {
    this.setupAudioEvents();
    this.restorePlayerState();
  }

  private setupAudioEvents(): void {
    // Listen for time updates
    fromEvent(this.audio, 'timeupdate').pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const flooredTime = Math.floor(this.audio.currentTime);
      if (flooredTime !== Math.floor(this.currentTimeSubject.value)) {
        this.currentTimeSubject.next(this.audio.currentTime);
        this.savePlayerState(); // Persist current time
      }
    });

    // Listen for duration changes (when metadata is loaded)
    fromEvent(this.audio, 'durationchange').pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.durationSubject.next(this.audio.duration);
    });

    // Listen for play/pause events
    fromEvent(this.audio, 'play').pipe(takeUntil(this.destroy$)).subscribe(() => this.isPlayingSubject.next(true));
    fromEvent(this.audio, 'pause').pipe(takeUntil(this.destroy$)).subscribe(() => this.isPlayingSubject.next(false));

    // Listen for when audio ends
    fromEvent(this.audio, 'ended').pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isPlayingSubject.next(false);
      this.currentTimeSubject.next(0); // Reset current time
      this.currentEpisodeSubject.next(null); // Clear current episode
      localStorage.removeItem(this.PLAYER_STATE_KEY); // Clear persisted state
    });

    // Handle errors
    fromEvent(this.audio, 'error').pipe(takeUntil(this.destroy$)).subscribe(e => {
      const errorMsg = 'Audio error occurred.';
      this.errorSubject.next(errorMsg);
      console.error('Audio error:', e);
    });
  }

  // Sets the current episode to play.
  // If the episode is already set, it tries to play from the last position or start from beginning.
  setEpisode(episode: Episode, playImmediately: boolean = true): void {
    const currentEpisodeId = this.currentEpisodeSubject.value?.id;
    if (episode.id !== currentEpisodeId || this.audio.src !== episode.audio_url) {
      // New episode or new URL for the same episode, reset
      this.audio.src = episode.audio_url;
      this.audio.load(); // Load the new source
      this.currentEpisodeSubject.next(episode);
      this.currentTimeSubject.next(0); // Reset time for new episode
      this.durationSubject.next(0); // Reset duration until loaded
      this.savePlayerState(episode.id, 0, false); // Persist new episode with time 0
    }

    if (playImmediately) {
      this.play();
    }
  }

  /**
   * Attempts to play the current audio.
   */
  play(): void {
    if (this.currentEpisodeSubject.value) {
      this.audio.play().catch(error => {
        this.errorSubject.next('Error playing audio.');
        console.error('Error playing audio:', error);
      });
    }
  }

  /**
   * Pauses the current audio.
   */
  pause(): void {
    this.audio.pause();
  }

  /**
   * Toggles play/pause state.
   */
  togglePlayPause(): void {
    if (this.isPlayingSubject.value) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Seeks to a specific time in the audio.
   */
  seek(time: number): void {
    if (this.audio.duration && !isNaN(this.audio.duration)) {
      this.audio.currentTime = Math.min(Math.max(0, time), this.audio.duration);
    } else {
      this.audio.currentTime = time; // Set even if duration is not known yet, hoping it works
    }
  }

  /**
   * Cancels playback and clears the current episode.
   */
  cancel(): void {
    this.pause();
    this.currentEpisodeSubject.next(null);
    this.currentTimeSubject.next(0);
    this.durationSubject.next(0);
    localStorage.removeItem(this.PLAYER_STATE_KEY);
  }

  private savePlayerState(episodeId?: number | null, currentTime?: number, isPlaying?: boolean): void {
    const state: PlayerState = {
      episodeId: episodeId !== undefined ? episodeId : this.currentEpisodeSubject.value?.id || null,
      currentTime: currentTime !== undefined ? currentTime : this.audio.currentTime,
      isPlaying: isPlaying !== undefined ? isPlaying : this.isPlayingSubject.value
    };
    if (state.episodeId !== null) {
      localStorage.setItem(this.PLAYER_STATE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(this.PLAYER_STATE_KEY);
    }
  }

  // This method assumes you have a way to fetch an episode by ID.
  // You may need to inject a service or provide a setter for the episode list.
  private restorePlayerState(): void {
    const storedState = localStorage.getItem(this.PLAYER_STATE_KEY);
    if (storedState) {
      const state: PlayerState = JSON.parse(storedState);
      if (state.episodeId !== null) {
        // Placeholder: You need to fetch the episode by ID from your episode list or service.
        // For now, you can expose a public method to set the episode externally after fetching.
        // Example:
        // this.setEpisodeById(state.episodeId, state.currentTime, state.isPlaying);
      }
    }
  }

  // Call this externally after fetching the episode by ID
  setEpisodeById(episode: Episode, currentTime: number, isPlaying: boolean): void {
    this.setEpisode(episode, false);
    this.audio.currentTime = currentTime;
    this.currentTimeSubject.next(currentTime);
    if (isPlaying) {
      this.play();
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${minutes}:${paddedSeconds}`;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.audio.pause(); // Ensure audio stops when service is destroyed
  }
}
