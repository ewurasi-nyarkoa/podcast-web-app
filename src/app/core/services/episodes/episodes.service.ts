import { inject, Injectable } from '@angular/core';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Episode, EpisodesResponse } from '../../interfaces/episodes';


@Injectable({
  providedIn: 'root'
})
export class EpisodesService {
private errorHandlingService = inject(ErrorHandlingService)
private http = inject(HttpClient)
private BASE_URL = environment.apiUrl



getEpisodes(page: number = 1): Observable<EpisodesResponse> {
  return this.http.get<EpisodesResponse>(`${this.BASE_URL}/v1/episodes?page=${page}`).pipe(
    catchError(error => this.errorHandlingService.handleHttpError(error))
  );
}



  // Fetch all episodes across all pages
  getAllEpisodes(): Observable<Episode[]> {
    return this.getEpisodes(1).pipe(
      switchMap(firstPage => {
        const totalPages = firstPage.meta.last_page;
        if (totalPages <= 1) {
          return of(firstPage.data);
        }
        // Create an array of observables for the remaining pages
        const requests: Observable<EpisodesResponse>[] = [];
        for (let page = 2; page <= totalPages; page++) {
          requests.push(this.getEpisodes(page));
        }
        return forkJoin(requests).pipe(
          map(responses => {
            // Combine all episodes from all pages
            const allEpisodes = responses.reduce((acc, res) => acc.concat(res.data), firstPage.data);
            return allEpisodes;
          })
        );
      })
    );
  }


  











}
