import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TournamentDataService {

  private readonly url = `${environment.url}/Tournaments`;

  constructor(private http: HttpClient) { }

  getTournamentById(id: string | null){
    return this.http.get(`${this.url}/${id}`);
  }
}
