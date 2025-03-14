import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'

import { 
  ReactiveFormsModule, 
  FormsModule,
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
  private router = inject(Router)

  // การสร้างตัวแปร FormGroup เพื่อผูกกับฟอร์ม
  registerForm: FormGroup
  isLoading = false
  errorMessage = ''
  submitted = false

  // สร้่างตัวแปรไว้เก็บข้อมูลที่ได้จากฟอร์ม
  userRegister = {
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  };

  // Constructor ใช้สำหรับการ Inject คลาส FormBuilder
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

  // ฟังก์ชันสำหรับตรวจสอบว่า password และ confirmPassword ตรงกันหรือไม่
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value
    const confirmPassword = form.get('confirmPassword')?.value
    
    if (password !== confirmPassword) {
      return { passwordMismatch: true }
    }
    
    return null
  }

  // Submit form function
  onSubmit() {
    this.submitted = true
    
    if (this.registerForm.invalid) {
      return
    }
    
    this.isLoading = true
    this.errorMessage = ''
  }

}
