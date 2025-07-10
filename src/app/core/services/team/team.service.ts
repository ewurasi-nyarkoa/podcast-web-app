import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, retry, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { ErrorHandlingService } from '../errors/error-handling.service';
import { TeamMember, CreateTeamMemberRequest } from '../../interfaces/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private errorHandlingService = inject(ErrorHandlingService);
  private teamMembersSubject = new BehaviorSubject<TeamMember[]>([]);
  teamMembers$ = this.teamMembersSubject.asObservable();

  fetchTeamMembers(): void {
    this.http
      .get<any>(`${this.apiUrl}/v1/team-members`)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error))
      )
      .subscribe((response) => {
        const teamMembers = response.data || response;
        this.teamMembersSubject.next(teamMembers);
      });
  }

  getTeamMembers(): Observable<TeamMember[]> {
    return this.teamMembers$;
  }

  getTeamMemberById(id: number): Observable<TeamMember> {
    return this.http
      .get<any>(`${this.apiUrl}/v1/team-members/${id}`)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        map(response => response.data || response)
      );
  }

  createTeamMember(teamMember: CreateTeamMemberRequest): Observable<TeamMember> {
    return this.http
      .post<any>(`${this.apiUrl}/v1/team-members`, teamMember)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap(() => {
          this.fetchTeamMembers();
        }),
        map(response => response.data || response)
      );
  }

  updateTeamMember(id: number, teamMember: Partial<CreateTeamMemberRequest>): Observable<TeamMember> {
    return this.http
      .put<any>(`${this.apiUrl}/v1/team-members/${id}`, teamMember)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap(() => {
          this.fetchTeamMembers();
        }),
        map(response => response.data || response)
      );
  }

  deleteTeamMember(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/v1/team-members/${id}`)
      .pipe(
        retry(3),
        catchError((error) => this.errorHandlingService.handleHttpError(error)),
        tap(() => {
          this.fetchTeamMembers();
        })
      );
  }
}
