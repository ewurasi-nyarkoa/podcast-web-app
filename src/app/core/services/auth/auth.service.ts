import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { LoginSuccessResponse, LogoutSuccessResponse, RegisterSuccessResponse } from '../../interfaces/auth-response';
import { UserLoginCredentials, UserRegisterCredentials } from '../../interfaces/user';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private errorHandlingService = inject(ErrorHandlingService);
  private BASE_URL = environment.apiUrl
  private readonly TOKEN_KEY = 'bearer_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private http = inject(HttpClient);

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: UserLoginCredentials): Observable<LoginSuccessResponse> {
    return this.http.post<LoginSuccessResponse>(`${this.BASE_URL}/v1/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error)=> this.errorHandlingService.handleHttpError(error) )
    );
  }

  register(credentials: UserRegisterCredentials): Observable<RegisterSuccessResponse> {
    return this.http.post<RegisterSuccessResponse>(`${this.BASE_URL}/v1/register`, credentials).pipe(
      tap((response) => response),
      catchError((error)=> this.errorHandlingService.handleHttpError(error) )
    );
  }


  logout(): Observable<LogoutSuccessResponse> {
    return this.http.post<LogoutSuccessResponse>(`${this.BASE_URL}/v1/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem(this.TOKEN_KEY);
        this.isAuthenticatedSubject.next(false);
      }),
      catchError((error)=> this.errorHandlingService.handleHttpError(error) )
    );
    
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }










}
