import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserModel } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.dotnet_api_url;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // สร้าง HTTP Headers พร้อม Token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  getCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}User/profile`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมด (สำหรับ Admin)
  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}User/all`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // อัปเดตข้อมูลผู้ใช้
  updateUser(userId: string, userData: Partial<UserModel>): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}User/${userId}`, userData, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // ลบผู้ใช้ (สำหรับ Admin)
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}User/${userId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
}
