using Microsoft.EntityFrameworkCore;
using AeroSafeBackend.Models;

namespace AeroSafeBackend.Data;

public class AeroSafeDbContext : DbContext
{
    public AeroSafeDbContext(DbContextOptions<AeroSafeDbContext> options) : base(options)
    {
    }

    public DbSet<Admin> Admins { get; set; }
    public DbSet<Pilot> Pilots { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Admin configuration
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasIndex(e => e.AdminUid).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Pilot configuration
        modelBuilder.Entity<Pilot>(entity =>
        {
            entity.HasIndex(e => e.PilotUid).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}



