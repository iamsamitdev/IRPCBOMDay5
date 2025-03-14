import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Component, CreateComponent, UpdateComponent } from '../models/component.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.dotnet_api_url}Component`

  // ดึงข้อมูลชิ้นส่วนทั้งหมด
  getAllComponents(): Observable<Component[]> {
    return this.http.get<Component[]>(this.apiUrl)
  }

  // ดึงข้อมูลชิ้นส่วนตาม ID
  getComponentById(id: number): Observable<Component> {
    return this.http.get<Component>(`${this.apiUrl}/${id}`)
  }

  // สร้างชิ้นส่วนใหม่
  createComponent(component: CreateComponent): Observable<Component> {
    return this.http.post<Component>(this.apiUrl, component)
  }

  // อัปเดตชิ้นส่วน
  updateComponent(id: number, component: UpdateComponent): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, component)
  }

  // ลบชิ้นส่วน
  deleteComponent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
} 