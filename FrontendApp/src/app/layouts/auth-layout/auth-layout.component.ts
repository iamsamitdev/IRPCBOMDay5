import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { UserModel } from '../../models/user.model'

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header - Fixed Top -->
      <header class="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
        <div class="w-full px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
                <a routerLink="/dashboard" class="flex items-center">
                    <img class="h-6 w-auto" src="assets/images/irpclogo.png" alt="IRPC Logo">
                    <span class="ml-2 mt-1 text-xl font-semibold text-gray-800">BOM</span>
                </a>
            </div>
            
            <!-- Desktop Navigation -->
            <div class="hidden sm:flex sm:items-center sm:space-x-4">
              <!-- Navigation Menu -->
              <nav class="flex space-x-8">
                <a 
                  routerLink="/dashboard" 
                  routerLinkActive="border-indigo-500 text-gray-900" 
                  [routerLinkActiveOptions]="{exact: true}"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
                >
                  แดชบอร์ด
                </a>
                <a 
                  routerLink="/bom" 
                  routerLinkActive="border-indigo-500 text-gray-900"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
                >
                  จัดการ BOM
                </a>
                <a 
                  routerLink="/machines" 
                  routerLinkActive="border-indigo-500 text-gray-900"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
                >
                  เครื่องจักร
                </a>
                <a 
                  routerLink="/components" 
                  routerLinkActive="border-indigo-500 text-gray-900"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
                >
                  ชิ้นส่วน
                </a>
                <a 
                  routerLink="/suppliers" 
                  routerLinkActive="border-indigo-500 text-gray-900"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 font-medium"
                >
                  ซัพพลายเออร์
                </a>
              </nav>
              
              <!-- User Profile -->
              <div class="ml-4 relative">
                <div>
                  <button 
                    (click)="toggleUserMenu()" 
                    type="button" 
                    class="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {{ currentUser?.fullName || currentUser?.username }}
                    </span>
                    <svg class="ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div 
                  *ngIf="isUserMenuOpen" 
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                >
                  <div class="py-1">
                    <a 
                      routerLink="/profile" 
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      (click)="toggleUserMenu()"
                    >
                      โปรไฟล์
                    </a>
                    <a 
                      routerLink="/settings" 
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      (click)="toggleUserMenu()"
                    >
                      ตั้งค่า
                    </a>
                  </div>
                  <div class="py-1">
                    <button 
                      (click)="logout()" 
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Mobile menu button -->
            <div class="flex items-center sm:hidden">
              <button 
                (click)="toggleMobileMenu()" 
                type="button" 
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path *ngIf="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  <path *ngIf="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div *ngIf="isMobileMenuOpen" class="sm:hidden">
          <div class="pt-2 pb-3 space-y-1">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700" 
              [routerLinkActiveOptions]="{exact: true}"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              (click)="toggleMobileMenu()"
            >
              แดชบอร์ด
            </a>
            <a 
              routerLink="/bom" 
              routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              (click)="toggleMobileMenu()"
            >
              จัดการ BOM
            </a>
            <a 
              routerLink="/machines" 
              routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              (click)="toggleMobileMenu()"
            >
              เครื่องจักร
            </a>
            <a 
              routerLink="/components" 
              routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              (click)="toggleMobileMenu()"
            >
              ชิ้นส่วน
            </a>
            <a 
              routerLink="/suppliers" 
              routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
              class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              (click)="toggleMobileMenu()"
            >
              ซัพพลายเออร์
            </a>
          </div>
          
          <!-- Mobile User Menu -->
          <div class="border-t border-gray-200 pt-4 pb-3">
            <div class="flex items-center px-4">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {{ getUserInitials() }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-gray-800">{{ currentUser?.fullName }}</div>
                <div class="text-sm font-medium text-gray-500">{{ currentUser?.email }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <a 
                routerLink="/profile" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                (click)="toggleMobileMenu()"
              >
                โปรไฟล์
              </a>
              <a 
                routerLink="/settings" 
                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                (click)="toggleMobileMenu()"
              >
                ตั้งค่า
              </a>
              <button 
                (click)="logout(); toggleMobileMenu()" 
                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main content - Add padding top to account for fixed header -->
      <main class="pt-16">
        <div class="w-full">
          <router-outlet></router-outlet>
        </div>
      </main>
      
      <!-- Footer -->
      <footer class="bg-white">
        <div class="w-full pb-12 px-4 sm:px-6 lg:px-8">
          <div class="border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div class="flex space-x-6 md:order-2">
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">Facebook</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">Twitter</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <span class="sr-only">LinkedIn</span>
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
            <p class="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2023 IRPC BOM. สงวนลิขสิทธิ์.
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AuthLayoutComponent implements OnInit {
  isMobileMenuOpen = false
  isUserMenuOpen = false
  currentUser: UserModel | null = null
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // ตรวจสอบสถานะการล็อกอินเมื่อคอมโพเนนต์ถูกโหลด
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'])
      return
    }
    
    // สมัครรับการเปลี่ยนแปลงของข้อมูลผู้ใช้
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user
      if (!user) {
        this.router.navigate(['/login'])
      }
    })
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }
  
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen
  }
  
  logout(): void {
    this.authService.logout()
    this.isUserMenuOpen = false
    this.router.navigate(['/login'])
  }
  
  getUserInitials(): string {
    if (!this.currentUser?.fullName) return '?'
    
    const nameParts = this.currentUser.fullName.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase()
    }
    
    return this.currentUser.fullName.charAt(0).toUpperCase()
  }
} 