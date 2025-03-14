import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap, catchError, throwError } from 'rxjs'
import { environment } from '../../environments/environment'
import { UserModel, UserModelLogin, UserModelRegister, AuthResponse } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = environment.dotnet_api_url

  constructor(
    private http: HttpClient
  ) { }

  // ฟังก์ชันสำหรับการ Login
  login(loginData: UserModelLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiURL}Auth/login`, loginData)
    .pipe(
      tap(response => {
        if(response.success){
          alert('Login Success')
        } else {
          alert('Login Fail')
        }
      }),
      catchError(error => {
        return throwError(() => error)
      }
    ))
  }

}
