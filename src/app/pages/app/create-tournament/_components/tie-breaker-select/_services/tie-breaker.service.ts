import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TieBreakerService {

  private readonly url = `${environment.url}/TournamentTieBreaker`;

  constructor(private http: HttpClient) { }

  getTieBreakers(){
    return this.http.get(`${this.url}`);
  }
}
