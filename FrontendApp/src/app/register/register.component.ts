import { Component } from '@angular/core';
import { 
  ReactiveFormsModule, 
  FormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  // การสร้างตัวแปร FormGroup เพื่อผูกกับฟอร์ม
  registerForm!: FormGroup;

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
  constructor(
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    // สร้างฟอร์มพร้อมตั้งค่า Validators
    this.registerForm = this.formBuilder.group({
      fullname: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required])
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  // Validator สำหรับตรวจสอบว่า password และ confirmPassword ตรงกันหรือไม่
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  // Submit form function
  onSubmit() {
    // ตรวจสอบว่าฟอร์มถูกต้องหรือไม่
    if (this.registerForm.valid) {
      // แสดงข้อมูลที่ได้จากฟอร์ม
      console.log(this.registerForm.value);
      
      // ในกรณีที่จะส่งข้อมูลไป API สามารถทำได้ที่นี่
      alert('ลงทะเบียนสำเร็จ');
      
      // ล้างข้อมูลในฟอร์ม
      this.registerForm.reset();
    } else {
      // ทำให้ validation errors ปรากฏโดยการ mark ทุก field ว่าถูก touched
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      
      alert('กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน');
    }
  }

  // Helper methods สำหรับแสดง validation errors
  isFieldValid(field: string) {
    const control = this.registerForm.get(field);
    return control?.invalid && control?.touched;
  }

  displayFieldError(field: string) {
    const control = this.registerForm.get(field);
    if (control?.errors?.['required']) {
      return 'กรุณากรอกข้อมูลในช่องนี้';
    }
    if (control?.errors?.['email']) {
      return 'กรุณากรอกอีเมลให้ถูกต้อง';
    }
    if (control?.errors?.['minlength']) {
      return `กรุณากรอกอย่างน้อย ${control.errors?.['minlength'].requiredLength} ตัวอักษร`;
    }
    if (control?.errors?.['passwordMismatch']) {
      return 'รหัสผ่านไม่ตรงกัน';
    }
    return '';
  }
}
