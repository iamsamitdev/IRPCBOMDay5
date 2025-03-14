import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms'
import { RouterModule, Router } from '@angular/router'

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
    
  }

}
