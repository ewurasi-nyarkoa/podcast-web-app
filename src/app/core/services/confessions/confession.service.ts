import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { BehaviorSubject, catchError, map, Observable, retry, tap } from 'rxjs';
import { confession } from '../../interfaces/confessions';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../errors/error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class ConfessionService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private errorHandlingService = inject(ErrorHandlingService);
  private confessionsSubject = new BehaviorSubject<confession[]>([]);
  confessions$ = this.confessionsSubject.asObservable();

  constructor() {}

  fecthConfessions(): void {
    this.http
      .get<confession[]>(`${this.apiUrl}/v1/confessions`)
      .pipe(
        retry(3), 
        catchError((error) => this.errorHandlingService.handleHttpError(error))
      )
      .subscribe((confessions) => {
        this.confessionsSubject.next(confessions);
      });
  }

  getConfessions(): Observable<confession[]> {
    return this.confessions$;
  }

  submitConfession(confession: {message: string; category: string; emotion: string; }): Observable<confession> {
    return this.http
      .post<confession>(`${this.apiUrl}/v1/confessions`, confession)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap((newConfession) => {
          const currentConfessions = this.confessionsSubject.getValue();
          this.confessionsSubject.next([...currentConfessions, newConfession]);
        })
      );
  }













  
}
