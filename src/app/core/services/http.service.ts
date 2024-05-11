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

  constructor(private http: HttpClient) { }


	get(uri: string, params: any[] = []): Observable<any> {
    let httpParams = new HttpParams();
    params.forEach(p => {
      if (p.value !== null) {
        httpParams = httpParams.append(p.key, p.value);
      }
    });

    return this.http.get<any>(this.cloeBEUrl + uri, {params: httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

	post(uri: string, body: any = {}, params: any[] = []): Observable<any> {
    let httpParams = new HttpParams();
    params.forEach(p => {
      httpParams = httpParams.append(p.key, p.value);
    });

    return this.http.post<any>(this.cloeBEUrl + uri, body, {params: httpParams})
      .pipe(takeUntil(this.cancelHttpCall));
  }

  put(uri: string, body: any = {}, params:any[] = []): Observable<any> {
    let httpParams = new HttpParams();
    params.forEach(p => {
      httpParams = httpParams.append(p.key, p.value);
    });

    return this.http.put<any>(this.cloeBEUrl + uri, body, {params: httpParams})
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
