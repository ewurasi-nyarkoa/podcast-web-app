import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Playlist, PlaylistsResponse, CreatePlaylistRequest, UpdatePlaylistRequest } from '../../interfaces/playlist';
import { environment } from '../../../../environments/environment';
import { ErrorHandlingService } from '../errors/error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private errorHandlingService = inject(ErrorHandlingService);
  private http = inject(HttpClient);
  private BASE_URL = environment.apiUrl;

  getPlaylists(): Observable<Playlist[]> {
    console.log('Fetching playlists from:', `${this.BASE_URL}/v1/playlists`);
    return this.http.get<PlaylistsResponse>(`${this.BASE_URL}/v1/playlists`).pipe(
      map(response => {
        console.log('Raw response:', response);
        return response.data.data;
      }),
      catchError(error => {
        console.error('Error fetching playlists:', error);
        return this.errorHandlingService.handleHttpError(error);
      })
    );
  }

  getPlaylist(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.BASE_URL}/v1/playlists/${id}`).pipe(
      catchError(error => this.errorHandlingService.handleHttpError(error))
    );
  }

  createPlaylist(playlist: CreatePlaylistRequest): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.BASE_URL}/v1/playlists`, playlist).pipe(
      catchError(error => this.errorHandlingService.handleHttpError(error))
    );
  }

  updatePlaylist(playlist: UpdatePlaylistRequest): Observable<Playlist> {
    return this.http.put<Playlist>(`${this.BASE_URL}/v1/playlists/${playlist.id}`, playlist).pipe(
      catchError(error => this.errorHandlingService.handleHttpError(error))
    );
  }

  addEpisodesToPlaylist(playlistId: number, episodeIds: number[]): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.BASE_URL}/v1/playlists/${playlistId}/episodes`, { episode_ids: episodeIds }).pipe(
      catchError(error => this.errorHandlingService.handleHttpError(error))
    );
  }

  deletePlaylist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/v1/playlists/${id}`).pipe(
      catchError(error => this.errorHandlingService.handleHttpError(error))
    );
  }
}