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

  fetchConfessions(): void {
    this.http
      .get<any>(`${this.apiUrl}/v1/confessions`)
      .pipe(
        retry(3), 
        catchError((error) => this.errorHandlingService.handleHttpError(error))
      )
      .subscribe((response) => {
        const confessions = response.data || response;

        const processedConfessions = confessions.map((conf: any) => ({
          ...conf,
          is_approved: conf.is_approved === true || conf.is_approved === 1
        }));
        this.confessionsSubject.next(processedConfessions);
      });
  }

  getConfessions(): Observable<confession[]> {
    return this.confessions$;
  }

  submitConfession(confession: {message: string; category: string; emotion: string; }): Observable<confession> {
    const confessionData = {
      ...confession,
      is_approved: false 
    };
    
    return this.http
      .post<any>(`${this.apiUrl}/v1/confessions`, confessionData)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap((response) => {
          this.fetchConfessions();
        }),
        map(response => response.data || response)
      );
  }

  getConfessionById(id: number): Observable<confession> {
    return this.http
      .get<any>(`${this.apiUrl}/v1/confessions/${id}`)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        map(response => response.data || response)
      );
  }

  updateConfessionStatus(id: number, isApproved: boolean): Observable<confession> {
    return this.http
      .patch<any>(`${this.apiUrl}/v1/confessions/${id}`, { is_approved: isApproved })
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap(() => {
          // Update local state
          const currentConfessions = this.confessionsSubject.getValue();
          const updatedConfessions = currentConfessions.map(conf => 
            conf.id === id ? { ...conf, is_approved: isApproved } : conf
          );
          this.confessionsSubject.next(updatedConfessions);
        }),
        map(response => response.data || response)
      );
  }

  deleteConfession(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/v1/confessions/${id}`)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap(() => {
          // Remove from local state
          const currentConfessions = this.confessionsSubject.getValue();
          const filteredConfessions = currentConfessions.filter(conf => conf.id !== id);
          this.confessionsSubject.next(filteredConfessions);
        })
      );
  }













  
}
