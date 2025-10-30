import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly KEY = "token"
  private readonly url = `${environment.url}/Auth`;

  constructor(private http: HttpClient, private router: Router) { }

  getAcessToken(){
    return localStorage.getItem(this.KEY);
  }

  setAccessToken(token: string){
    localStorage.setItem(this.KEY, token);
  }

  isLoggedIn(): boolean {
    const token = this.getAcessToken();

    return !token ? false : true
  }

  logout(){
    localStorage.removeItem(this.KEY);
    this.http.post(`${this.url}/logout`, {}, { withCredentials: true}).subscribe();
    this.router.navigate(['/login']);
  }

  refreshToken(){
    return this.http.post(`${this.url}/refresh`, {}, {withCredentials: true})
      .pipe(
          tap((res: any) => {
              if(res?.data) this.setAccessToken(res?.data);
        }),
        catchError(() => {
          this.logout();
          return of(null);
        })
    )
  }


}
