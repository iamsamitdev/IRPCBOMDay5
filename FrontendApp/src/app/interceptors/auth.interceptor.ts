import { HttpInterceptorFn } from '@angular/common/http'
import { CookieService } from 'ngx-cookie-service'
import { inject } from '@angular/core'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService)
  const token = cookieService.get('token')
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    })
    return next(authReq)
  }
  
  return next(req)
} 