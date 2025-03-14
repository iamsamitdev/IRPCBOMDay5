using System.Security.Claims;
using BackendAPI.Data;
using BackendAPI.DTOs;
using BackendAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BackendAPI.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        private readonly JwtSettings _jwtSettings;
        
        public AuthService(ApplicationDbContext context, JwtService jwtService, IOptions<JwtSettings> jwtSettings)
        {
            _context = context;
            _jwtService = jwtService;
            _jwtSettings = jwtSettings.Value;
        }
        
        public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
            {
                throw new Exception("Username already exists");
            }
            
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                throw new Exception("Email already exists");
            }
            
            // Create new user
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                FullName = registerDto.FullName,
                Role = registerDto.Role,
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            
            // Add user to database
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            
            // Generate tokens
            var token = _jwtService.GenerateJwtToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();
            
            // Save refresh token
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenValidityInDays);
            await _context.SaveChangesAsync();
            
            // Return response
            return new AuthResponseDTO
            {
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                Token = token,
                RefreshToken = refreshToken,
                TokenExpiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes)
            };
        }
        
        public async Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto)
        {
            // Find user by username
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);
            
            // Check if user exists
            if (user == null)
            {
                throw new Exception("Invalid username or password");
            }
            
            // Check if user is active
            if (!user.IsActive)
            {
                throw new Exception("User account is disabled");
            }
            
            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid username or password");
            }
            
            // Generate tokens
            var token = _jwtService.GenerateJwtToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();
            
            // Save refresh token
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenValidityInDays);
            await _context.SaveChangesAsync();
            
            // Return response
            return new AuthResponseDTO
            {
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                Token = token,
                RefreshToken = refreshToken,
                TokenExpiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes)
            };
        }
        
        public async Task<AuthResponseDTO> RefreshTokenAsync(string token, string refreshToken)
        {
            var principal = _jwtService.GetPrincipalFromExpiredToken(token);
            var userId = int.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);
            
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new Exception("Invalid refresh token");
            }
            
            var newToken = _jwtService.GenerateJwtToken(user);
            var newRefreshToken = _jwtService.GenerateRefreshToken();
            
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenValidityInDays);
            await _context.SaveChangesAsync();
            
            return new AuthResponseDTO
            {
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                Token = newToken,
                RefreshToken = newRefreshToken,
                TokenExpiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes)
            };
        }
        
        public async Task RevokeTokenAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null)
            {
                throw new Exception("User not found");
            }
            
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _context.SaveChangesAsync();
        }
    }
} 