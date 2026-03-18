using System;
using System.ComponentModel.DataAnnotations;

namespace CreditRiskManagementSystem.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public int RoleId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        public Role Role { get; set; }
    }
}