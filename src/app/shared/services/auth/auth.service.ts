import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, finalize, map, of, take, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly KEY = "token"
  private readonly url = `${environment.url}/Auth`;
  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) { }

  getAcessToken(){
    return localStorage.getItem(this.KEY);
  }

  setAccessToken(token: string){
    localStorage.setItem(this.KEY, token);
  }

  removeAccessToken(){
    localStorage.removeItem(this.KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getAcessToken();

    return !token ? false : true
  }

  logout(){
    this.http.post(`${this.url}/logout`, {}, { withCredentials: true}).subscribe();
    localStorage.removeItem(this.KEY);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(){
    if(this.refreshInProgress){
      return this.refreshSubject.pipe(filter(token => token !== null), take(1), map(token => token as string));
    }

    this.refreshInProgress = true;
    this.refreshSubject.next(null);

    return this.http.post(`${this.url}/refresh`, {}, {withCredentials: true})
      .pipe(
          tap((res: any) => {
              const token = res?.data ?? null;
              this.setAccessToken(token);
              this.refreshSubject.next(token);
        }),
        map(res => res?.data ?? null),
        catchError((error) => {
          this.refreshSubject.next(null);
          return throwError(() => error);
        }),
        finalize(() => {
          this.refreshInProgress = false;
        })
    )
  }


}
