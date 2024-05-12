import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  cancelHttpCall: Subject<void> = new Subject<void>();
	cloeBEUrl = environment.url;

  constructor(private _http: HttpClient) { }


	get(uri: string, params: any[] = []): Observable<any> {
    let _httpParams = new HttpParams();
    params.forEach(p => {
      if (p.value !== null) {
        _httpParams = _httpParams.append(p.key, p.value);
      }
    });

    return this._http.get<any>(this.cloeBEUrl + uri, {params: _httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

	post(uri: string, body: any = {}, params: any[] = []): Observable<any> {
    let _httpParams = new HttpParams();
    params.forEach(p => {
      _httpParams = _httpParams.append(p.key, p.value);
    });

    return this._http.post<any>(this.cloeBEUrl + uri, body, {params: _httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

  put(uri: string, body: any = {}, params:any[] = []): Observable<any> {
    let _httpParams = new HttpParams();
    params.forEach(p => {
      _httpParams = _httpParams.append(p.key, p.value);
    });

    return this._http.put<any>(this.cloeBEUrl + uri, body, {params: _httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

  delete(uri: string, params: any[] = []): Observable<any> {
    let _httpParams = new HttpParams();
    params.forEach(p => {
      _httpParams = _httpParams.append(p.key, p.value);
    });

    return this._http.delete<any>(this.cloeBEUrl + uri, {params: _httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

	unsubscribeHttpCall() {
    this.cancelHttpCall.next();
  }
}
