using System;

using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class ComplaintLog
    {
    [Key]
    public int LogId { get; set; }
        public int ComplaintId { get; set; }
    public Complaint? Complaint { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public string LogType { get; set; } = string.Empty;
        public string? Details { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
