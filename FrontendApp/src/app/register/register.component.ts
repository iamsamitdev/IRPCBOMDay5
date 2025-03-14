import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { UserModelRegister } from '../models/user.model'
import Swal from 'sweetalert2'

import { 
  ReactiveFormsModule, 
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)
  
  registerForm: FormGroup
  isLoading = false
  errorMessage = ''
  submitted = false
  
  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    })
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value
    const confirmPassword = form.get('confirmPassword')?.value
    
    if (password !== confirmPassword) {
      return { passwordMismatch: true }
    }
    
    return null
  }
  
  onSubmit(): void {
    this.submitted = true
    
    if (this.registerForm.invalid) {
      return
    }
    
    this.isLoading = true
    this.errorMessage = ''
    
    // แสดง loading
    Swal.fire({
      title: 'กำลังดำเนินการ',
      text: 'กรุณารอสักครู่...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })
    
    const { firstName, lastName, email, username, password, confirmPassword } = this.registerForm.value
    
    const registerData: UserModelRegister = {
      username,
      email,
      password,
      confirmPassword,
      fullName: `${firstName} ${lastName}`,
      role: 'User' // กำหนดค่าเริ่มต้นเป็น User
    }
    
    this.authService.register(registerData)
      .subscribe({
        next: (response) => {
          // ตรวจสอบค่า success จาก response
          if (response && response.success === false) {
            // กรณีสมัครสมาชิกไม่สำเร็จ แต่ได้รับการตอบกลับจาก API
            this.isLoading = false
            this.errorMessage = response.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง'
            
            Swal.fire({
              title: 'ไม่สำเร็จ!',
              text: this.errorMessage,
              icon: 'error',
              confirmButtonText: 'ลองใหม่',
              confirmButtonColor: '#d33'
            })
          } else {
            // กรณีสมัครสมาชิกสำเร็จ
            Swal.fire({
              title: 'สมัครสมาชิกสำเร็จ!',
              text: 'คุณสามารถเข้าสู่ระบบได้ทันที',
              icon: 'success',
              confirmButtonText: 'เข้าสู่ระบบ',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              this.router.navigate(['/login'], { 
                queryParams: { registered: 'success' } 
              })
            })
          }
        },
        error: (error) => {
          this.isLoading = false
          this.errorMessage = error.error?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง'
          
          Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: this.errorMessage,
            icon: 'error',
            confirmButtonText: 'ลองใหม่',
            confirmButtonColor: '#d33'
          })
        }
      })
  }

}
