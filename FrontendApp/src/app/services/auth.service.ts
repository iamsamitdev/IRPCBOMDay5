import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs'
import { CookieService } from 'ngx-cookie-service'
import { environment } from '../../environments/environment'
import { UserModelLogin, UserModelRegister, UserModel, AuthResponse } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.dotnet_api_url
  private currentUserSubject: BehaviorSubject<UserModel | null>
  public currentUser: Observable<UserModel | null>

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    // ตรวจสอบว่ามีข้อมูลผู้ใช้ใน cookie หรือไม่
    const userJson = this.cookieService.get('currentUser')
    this.currentUserSubject = new BehaviorSubject<UserModel | null>(
      userJson ? JSON.parse(userJson) : null
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  public get currentUserValue(): UserModel | null {
    return this.currentUserSubject.value
  }

  // ล็อกอิน
  login(loginData: UserModelLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Auth/login`, loginData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            // บันทึกข้อมูลลง cookie
            this.cookieService.set('currentUser', JSON.stringify(response.data.user), { expires: 1 }) // หมดอายุใน 1 วัน
            this.cookieService.set('token', response.data.token, { expires: 1 })
            
            // อัปเดต BehaviorSubject
            this.currentUserSubject.next(response.data.user)
          }
        }),
        catchError(error => {
          return throwError(() => error)
        })
      )
  }

  // ลงทะเบียน
  register(registerData: UserModelRegister): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Auth/register`, registerData)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        })
      )
  }

  // ล็อกเอาท์
  logout(): void {
    // ลบข้อมูลจาก cookie
    this.cookieService.delete('currentUser')
    this.cookieService.delete('token')
    
    // รีเซ็ต BehaviorSubject
    this.currentUserSubject.next(null)
  }

  // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
  isLoggedIn(): boolean {
    return !!this.currentUserValue && !!this.cookieService.get('token')
  }

  // ดึง token
  getToken(): string {
    return this.cookieService.get('token')
  }
}
