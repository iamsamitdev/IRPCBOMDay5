import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { Machine, CreateMachine, UpdateMachine } from '../models/machine.model'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.dotnet_api_url}Machine`

  // ดึงข้อมูลเครื่องจักรทั้งหมด
  getAllMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.apiUrl)
  }

  // ดึงข้อมูลเครื่องจักรตาม ID
  getMachineById(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/${id}`)
  }

  // สร้างเครื่องจักรใหม่
  createMachine(machine: CreateMachine): Observable<Machine> {
    return this.http.post<Machine>(this.apiUrl, machine)
  }

  // อัปเดตเครื่องจักร
  updateMachine(id: number, machine: UpdateMachine): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, machine)
  }

  // ลบเครื่องจักร
  deleteMachine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
} 