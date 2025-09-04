
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Role> Roles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<ComplaintAssignment> ComplaintAssignments { get; set; }
        public DbSet<ComplaintLog> ComplaintLogs { get; set; }
        public DbSet<AISuggestion> AISuggestions { get; set; }
        public DbSet<ComplaintCategory> ComplaintCategories { get; set; }
        public DbSet<ComplaintCategoryMap> ComplaintCategoryMaps { get; set; }

    public DbSet<TestItem> TestItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Unique constraints, relationships, etc. สามารถเพิ่มได้ตามต้องการ
            modelBuilder.Entity<Role>().HasIndex(r => r.RoleName).IsUnique();
            modelBuilder.Entity<Department>().HasIndex(d => d.DepartmentName).IsUnique();
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Complaint>().HasIndex(c => c.TicketId).IsUnique();
            modelBuilder.Entity<ComplaintCategory>().HasIndex(c => c.CategoryName).IsUnique();

            // Ignore ambiguous navigation property for migration
            modelBuilder.Entity<ComplaintAssignment>().Ignore(ca => ca.AISuggestionDept);
        }
    }
}
