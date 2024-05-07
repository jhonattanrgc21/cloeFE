import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  cancelHttpCall: Subject<void> = new Subject<void>();
	cloeBEUrl = environment.url;

  constructor(private http: HttpClient) { }


	get(uri: string, params: any[] = []): Observable<any> {
    const headers = new HttpHeaders()
      .append('Accept', 'application/json');

    let httpParams = new HttpParams();
    params.forEach(p => {
      if (p.value !== null) {
        httpParams = httpParams.append(p.key, p.value);
      }
    });

    return this.http.get<any>(this.cloeBEUrl + uri, {headers, params: httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

	post(service: 'canales' | 'marchamos' | 'incomex', uri: string, body: any = {}, params: any[] = []): Observable<any> {
    const headers = new HttpHeaders()
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');

    let httpParams = new HttpParams();
    params.forEach(p => {
      httpParams = httpParams.append(p.key, p.value);
    });

    return this.http.post<any>(this.cancelHttpCall + uri, JSON.stringify(body), {headers, params: httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

  put(uri: string, body: any = {}, params:any[] = []): Observable<any> {
    const headers = new HttpHeaders()
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');

    let httpParams = new HttpParams();
    params.forEach(p => {
      httpParams = httpParams.append(p.key, p.value);
    });

    return this.http.put<any>(this.cloeBEUrl + uri, JSON.stringify(body), {headers, params: httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

  delete(uri: string, params: any[] = []): Observable<any> {
    let httpParams = new HttpParams();
    params.forEach(p => {
      httpParams = httpParams.append(p.key, p.value);
    });

    return this.http.delete<any>(this.cloeBEUrl + uri, {params: httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

	unsubscribeHttpCall() {
    this.cancelHttpCall.next();
  }
}
