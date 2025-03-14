import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { BillOfMaterial, BomTreeNode, CreateBillOfMaterial, UpdateBillOfMaterial } from '../models/bom.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BomService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.dotnet_api_url}BillOfMaterial`

  // ดึงข้อมูล BOM ทั้งหมด
  getAllBoms(): Observable<BillOfMaterial[]> {
    return this.http.get<BillOfMaterial[]>(this.apiUrl)
  }

  // ดึงข้อมูล BOM ตาม ID
  getBomById(id: number): Observable<BillOfMaterial> {
    return this.http.get<BillOfMaterial>(`${this.apiUrl}/${id}`)
  }

  // ดึงข้อมูล BOM ตามเครื่องจักร
  getBomsByMachine(machineId: number): Observable<BillOfMaterial[]> {
    return this.http.get<BillOfMaterial[]>(`${this.apiUrl}/Machine/${machineId}`)
  }

  // ดึงข้อมูล BOM ตามชิ้นส่วน
  getBomsByComponent(componentId: number): Observable<BillOfMaterial[]> {
    return this.http.get<BillOfMaterial[]>(`${this.apiUrl}/Component/${componentId}`)
  }

  // ดึงข้อมูลโครงสร้าง BOM แบบต้นไม้ตามเครื่องจักร
  getBomTreeByMachine(machineId: number): Observable<BomTreeNode[]> {
    return this.http.get<BomTreeNode[]>(`${this.apiUrl}/Tree/Machine/${machineId}`)
  }

  // ดึงข้อมูลโครงสร้าง BOM แบบต้นไม้ตามชิ้นส่วน
  getBomTreeByComponent(componentId: number): Observable<BomTreeNode> {
    return this.http.get<BomTreeNode>(`${this.apiUrl}/Tree/Component/${componentId}`)
  }

  // สร้าง BOM ใหม่
  createBom(bom: CreateBillOfMaterial): Observable<BillOfMaterial> {
    return this.http.post<BillOfMaterial>(this.apiUrl, bom)
  }

  // อัปเดต BOM
  updateBom(id: number, bom: UpdateBillOfMaterial): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, bom)
  }

  // ลบ BOM
  deleteBom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
} 