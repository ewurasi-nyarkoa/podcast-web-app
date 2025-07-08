// src/app/core/services/error-handler.service.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor() {}

  handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred.
      console.error('Client-side error:', error.error.message);
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error)}`
      );

      switch (error.status) {
        case 0:
          errorMessage = 'Network Error: Could not connect to the server.';
          break;
        case 400:
          errorMessage =
            'Bad Request: The server could not understand the request.';
          break;
        case 401:
          errorMessage = 'Authentication failed. Please log in again.';
          // You might want to redirect to login page here or trigger logout
          break;
        case 403:
          errorMessage =
            'Unauthorized access. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage =
            'Not Found: The requested resource could not be found.';
          break;
        case 409:
          errorMessage =
            'Conflict: The request could not be completed due to a conflict with the current state of the target resource.';
          break;
        case 422: // Often used for validation errors in APIs
          errorMessage =
            'Unprocessable Entity: The request was well-formed but was unable to be followed due to semantic errors.';
          break;
        case 500:
          errorMessage =
            'Internal Server Error: Something went wrong on the server.';
          break;
        case 503:
          errorMessage =
            'Service Unavailable: The server is currently unable to handle the request due to a temporary overload or scheduled maintenance.';
          break;
        default:
          // Handle other status codes or a range of status codes
          if (error.status >= 400 && error.status < 500) {
            errorMessage = `Client Error (${error.status}): ${
              error.statusText || 'Unknown Client Error'
            }`;
          } else if (error.status >= 500 && error.status < 600) {
            errorMessage = `Server Error (${error.status}): ${
              error.statusText || 'Unknown Server Error'
            }`;
          } else {
            errorMessage = `Error ${error.status}: ${
              error.statusText || 'Unknown Error'
            }`;
          }
          break;
      }

      // If the API sends a specific error message in the response body, prioritize it
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    window.alert(errorMessage);

    return throwError(() => new Error(errorMessage));
  }

}
