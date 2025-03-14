// โมเดลสำหรับการล็อกอิน
export class UserModelLogin {
    username!: string
    password!: string
}

// โมเดลสำหรับการลงทะเบียน
export class UserModelRegister {
    username!: string
    email!: string
    password!: string
    confirmPassword!: string
    fullName!: string
    role!: string
}

// โมเดลสำหรับข้อมูลผู้ใช้
export class UserModel {
    id?: string
    username!: string
    email!: string
    fullName!: string
    role!: string
    token?: string
}

// โมเดลสำหรับการตอบกลับจาก API
export interface AuthResponse {
    success: boolean
    message: string
    data?: {
        token: string
        user: UserModel
    }
    errors?: any
}