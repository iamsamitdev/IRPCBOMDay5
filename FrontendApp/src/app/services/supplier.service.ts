import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Supplier, CreateSupplier, UpdateSupplier } from '../models/supplier.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.dotnet_api_url}Supplier`

  // ดึงข้อมูลซัพพลายเออร์ทั้งหมด
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl)
  }

  // ดึงข้อมูลซัพพลายเออร์ตาม ID
  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`)
  }

  // สร้างซัพพลายเออร์ใหม่
  createSupplier(supplier: CreateSupplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier)
  }

  // อัปเดตซัพพลายเออร์
  updateSupplier(id: number, supplier: UpdateSupplier): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, supplier)
  }

  // ลบซัพพลายเออร์
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
} 