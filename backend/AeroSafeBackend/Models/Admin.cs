using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AeroSafeBackend.Models;

[Table("admins")]
public class Admin
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(60)]
    [Column("admin_uid")]
    public string AdminUid { get; set; } = string.Empty;

    [Required]
    [StringLength(120)]
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [StringLength(160)]
    [EmailAddress]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(60)]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}



