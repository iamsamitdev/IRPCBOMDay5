import { Component } from '@angular/core'
import { 
  ReactiveFormsModule, 
  FormsModule,
  FormGroup,
  FormBuilder,
  FormControl
} from '@angular/forms'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // การสร้างตัวแปร FormGroup เพื่อผูกกับฟอร์ม
  loginForm!: FormGroup

  // สร้่างตัวแปรไว้เก็บข้อมูลที่ได้จากฟอร์ม
  userLogin = {
    username: '',
    password: ''
  }

  // Constructor ใช้สำหรับการ Inject คลาส FormBuilder
  constructor(
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    // สร้างฟอร์ม
    this.loginForm = this.formBuilder.group({
      username: new FormControl(''),
      password: new FormControl('')
    })
  }

  // Submit form function
  onSubmit() {
    // แสดงข้อมูลที่ได้จากฟอร์ม
    console.log(this.loginForm.value)

    if(this.loginForm.value.username === 'admin' && this.loginForm.value.password === '1234') {
      alert('Login Success')
    }
    else {
      alert('Login Fail')
    }
    
  }

}
