using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AeroSafeBackend.Models;

[Table("pilots")]
public class Pilot
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [StringLength(60)]
    [Column("pilot_uid")]
    public string PilotUid { get; set; } = string.Empty;

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

    [Column("fatigue_flag")]
    public bool FatigueFlag { get; set; } = false;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}



