import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Category, CreateCategory, UpdateCategory } from '../models/category.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.dotnet_api_url}Category`

  // ดึงข้อมูลหมวดหมู่ทั้งหมด
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl)
  }

  // ดึงข้อมูลหมวดหมู่ตาม ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`)
  }

  // สร้างหมวดหมู่ใหม่
  createCategory(category: CreateCategory): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category)
  }

  // อัปเดตหมวดหมู่
  updateCategory(id: number, category: UpdateCategory): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, category)
  }

  // ลบหมวดหมู่
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
} 