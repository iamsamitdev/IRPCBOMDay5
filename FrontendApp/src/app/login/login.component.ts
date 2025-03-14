import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthService } from '../services/auth.service'

import { 
  ReactiveFormsModule, 
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms'
import { RouterModule, Router } from '@angular/router'

// Import SweetAlert2
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb = inject(FormBuilder)
  private router = inject(Router)
  private authService = inject(AuthService)

  // การสร้างตัวแปร FormGroup เพื่อผูกกับฟอร์ม
  loginForm!: FormGroup

  // สร้างตัวแปรไว้แสดงสถานะการโหลดข้อมูล
  isLoading = false

  // สร้างตัวแปรไว้แสดงข้อความ Error
  errorMessage = ''

  // สร้างตัวแปรไว้เก็บข้อมูลการส่งฟอร์ม
  submitted = false

  // สร้่างตัวแปรไว้เก็บข้อมูลที่ได้จากฟอร์ม
  userLogin = {
    username: '',
    password: ''
  }

  // Constructor ใช้สำหรับการ Inject คลาส FormBuilder
  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    })
  }

  // Submit form function
  onSubmit() {
    // แสดงข้อมูลที่ได้จากฟอร์ม
    console.log(this.loginForm.value)

    this.submitted = true
    
    if (this.loginForm.invalid) {
      return
    }
    
    this.isLoading = true
    this.errorMessage = ''

    // ส่งข้อมูลไปยังฟังก์ชัน login ใน AuthService
    this.authService.login(this.loginForm.value)
    .subscribe({
      next: (response) => {
        // ตรวจสอบว่า success หรือไม่
        if (response.success) {
          // แสดงข้อความเมื่อ Login สำเร็จ
          Swal.fire({
            icon: 'success',
            title: 'Login Success',
            text: 'Welcome to our website',
            showConfirmButton: false,
            timer: 2000
          })
          // ส่งไปหน้า Home
          this.router.navigate(['/dashboard'])
        } else {
          // แสดงข้อความเมื่อ Login ไม่สำเร็จ
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: response.message,
            showConfirmButton: false,
            timer: 1500
          })
        }
        this.isLoading = false
      },
      error: (error) => {
        console.log(error)
        // แสดงข้อความเมื่อ Login ไม่สำเร็จ
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
    
  }

}
