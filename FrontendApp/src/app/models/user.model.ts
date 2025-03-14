// Model สำหรับการ Login
export class UserModelLogin {
    username!: string
    password!: string
}

// Model สำหรับการ Register
export class UserModelRegister {
    username!: string
    email!: string
    password!: string
    confirmPassword!: string
    fullName!: string
    role!: string
}

// Model สำหรับการ Profile
export class UserModel {
    id?: string
    username!: string
    email!: string
    fullName!: string
    role!: string
    token?: string
}

// Model สำหรับการตอบกลับจาก Backend API
export interface AuthResponse {
    success: boolean
    message: string
    data?: {
        token: string
        user: UserModel
    }
    errors?: any
}