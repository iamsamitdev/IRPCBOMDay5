import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { UnitOfMeasure, CreateUnitOfMeasure, UpdateUnitOfMeasure } from '../models/unit-of-measure.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.dotnet_api_url}UnitOfMeasure`

  // ดึงข้อมูลหน่วยวัดทั้งหมด
  getAllUnitOfMeasures(): Observable<UnitOfMeasure[]> {
    return this.http.get<UnitOfMeasure[]>(this.apiUrl)
  }

  // ดึงข้อมูลหน่วยวัดตาม ID
  getUnitOfMeasureById(id: number): Observable<UnitOfMeasure> {
    return this.http.get<UnitOfMeasure>(`${this.apiUrl}/${id}`)
  }

  // สร้างหน่วยวัดใหม่
  createUnitOfMeasure(unitOfMeasure: CreateUnitOfMeasure): Observable<UnitOfMeasure> {
    return this.http.post<UnitOfMeasure>(this.apiUrl, unitOfMeasure)
  }

  // อัปเดตหน่วยวัด
  updateUnitOfMeasure(unitOfMeasure: UpdateUnitOfMeasure): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${unitOfMeasure.id}`, unitOfMeasure)
  }

  // ลบหน่วยวัด
  deleteUnitOfMeasure(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
} 