using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTOs
{
    public class RegisterDTO
    {
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public required string Username { get; set; }
        
        [Required]
        [StringLength(50)]
        [EmailAddress]
        public required string Email { get; set; }
        
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public required string Password { get; set; }
        
        [Required]
        [Compare("Password")]
        public required string ConfirmPassword { get; set; }
        
        [StringLength(100)]
        public required string FullName { get; set; }
        
        [StringLength(20)]
        public string Role { get; set; } = "User"; // Default role
    }
    
    public class LoginDTO
    {
        [Required]
        public required string Username { get; set; }
        
        [Required]
        public required string Password { get; set; }
    }
    
    public class AuthResponseDTO
    {
        public int UserId { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public required string Role { get; set; }
        public required string Token { get; set; }
        public required string RefreshToken { get; set; }
        public required DateTime TokenExpiration { get; set; }
    }
    
    public class RefreshTokenDTO
    {
        [Required]
        public required string RefreshToken { get; set; }
    }
} 