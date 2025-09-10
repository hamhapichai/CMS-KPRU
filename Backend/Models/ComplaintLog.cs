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
        public int? DepartmentId { get; set; }
        public Department? Department { get; set; }
        public string Action { get; set; } = string.Empty; // Forwarded, Received, InProgress, Completed, Closed, Reopened
        public string? Notes { get; set; } // โน๊ตหรือคำอธิบายเพิ่มเติม
        public string? PreviousStatus { get; set; }
        public string? NewStatus { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string? Metadata { get; set; } // JSON data สำหรับข้อมูลเพิ่มเติม
    }
}
