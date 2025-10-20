import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private url = `${environment.url}/Users`;

  constructor(private http: HttpClient) { }

  register(credentials: any){
    return this.http.post(`${this.url}`, credentials);
  }
}
