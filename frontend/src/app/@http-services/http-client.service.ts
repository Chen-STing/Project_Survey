import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient) { }

  // post 帶 params 參數
  postParamsAPI(url: string, params: HttpParams) {
    return this.http.post(url, params);
  }

  // post 帶 body (JSON)參數
  postBodyAPI(url: string, body: any) {
    return this.http.post(url, body);
  }

  // get
  getAPI(url: string) {
    return this.http.get(url);
  }


}
