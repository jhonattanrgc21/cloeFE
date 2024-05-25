import { StorageService } from './../services/storage.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, finalize, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	cloeUrl = environment.url;

  constructor(
		private authService: AuthService,
		private spinnerService: SpinnerService,
	) {}

	private _getHeaders(){
		const token = this.authService.currentToken;
		return {
			Authorization: `Bearer ${token}`,
		};
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;

		this.spinnerService.show();
		// request = req.clone({
		// 	setHeaders: this._getHeaders()
		// });

    if (this.authService.currentToken && this.authService.currentToken != '') {
      request = req.clone({
        setHeaders: this._getHeaders()
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si la respuesta es 401 (No autorizado), intentar refrescar el token
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // Si el token se actualiza con éxito, reintentar la solicitud original con el nuevo token
              request = request.clone({
                setHeaders: this._getHeaders()
              });
              return next.handle(request);
            }),
            catchError((err) => {
              // Si no se puede refrescar el token, redirigir a la página de inicio de sesión
              this.authService.logout();
              return throwError(err);
            }),
						finalize(() => this.spinnerService.hide())
          );
        } else {
          return throwError(error);
        }
      }),
			finalize(() => this.spinnerService.hide())
    );
  }

}
