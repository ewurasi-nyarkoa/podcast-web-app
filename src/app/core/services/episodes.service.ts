import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, retry, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ErrorHandlingService } from './errors/error-handling.service';
import { Episode, CreateEpisodeRequest } from '../interfaces/episode';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private errorHandlingService = inject(ErrorHandlingService);
  private episodesSubject = new BehaviorSubject<Episode[]>([]);
  episodes$ = this.episodesSubject.asObservable();

  getEpisodes(): Observable<Episode[]> {
    return this.http
      .get<any>(`${this.apiUrl}/v1/episodes`)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap((response) => {
          const episodes = response.data || response;
          this.episodesSubject.next(episodes);
        }),
        map(response => response.data || response)
      );
  }

  getEpisodeById(id: number): Observable<Episode> {
    return this.http
      .get<any>(`${this.apiUrl}/v1/episodes/${id}`)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        map(response => response.data || response)
      );
  }

  createEpisode(episode: CreateEpisodeRequest): Observable<Episode> {
    return this.http
      .post<any>(`${this.apiUrl}/v1/episodes`, episode)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap(() => {
          this.getEpisodes().subscribe();
        }),
        map(response => response.data || response)
      );
  }

  updateEpisode(id: number, episode: Partial<CreateEpisodeRequest>): Observable<Episode> {
    return this.http
      .put<any>(`${this.apiUrl}/v1/episodes/${id}`, episode)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap(() => {
          this.getEpisodes().subscribe();
        }),
        map(response => response.data || response)
      );
  }

  deleteEpisode(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/v1/episodes/${id}`)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap(() => {
          this.getEpisodes().subscribe();
        })
      );
  }
}