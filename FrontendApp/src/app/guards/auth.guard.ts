import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/auth.service'

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)
  
  if (authService.isLoggedIn()) {
    return true
  }
  
  // ถ้าไม่ได้ล็อกอิน ให้นำทางไปยังหน้าล็อกอิน
  router.navigate(['/login'])
  return false
} 