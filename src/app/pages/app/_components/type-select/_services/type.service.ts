import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  private readonly url = `${environment.url}/TournamentTypes`;

  constructor(private http: HttpClient) { }

  getTypes(){
    return this.http.get(`${this.url}`);
  }
}
