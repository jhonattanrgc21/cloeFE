import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { StorageService } from './services/storage.service';
import { HttpService } from './services/http.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		HttpClientModule,
  ],
	providers: [
		HttpService,
		StorageService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class CoreModule { }
