using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; } = true;
        public ICollection<ComplaintAssignment> ComplaintAssignments { get; set; }
        public ICollection<ComplaintLog> ComplaintLogs { get; set; }
    }
}
