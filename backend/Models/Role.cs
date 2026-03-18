using System.ComponentModel.DataAnnotations;
namespace CreditRiskManagementSystem.Models
{
    public class Role
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}