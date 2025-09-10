using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class ComplaintAssignment
    {
        [Key]
        public int AssignmentId { get; set; }
        public int ComplaintId { get; set; }
        public Complaint? Complaint { get; set; }
        public int AssignedToDeptId { get; set; }
        public Department? AssignedToDept { get; set; }
        public int AssignedByUserId { get; set; }
        public User? AssignedByUser { get; set; }
        public int? AssignedToUserId { get; set; } // เจ้าหน้าที่ที่รับผิดชอบ
        public User? AssignedToUser { get; set; }
        public string Status { get; set; } = "Forwarded"; // Forwarded, Received, InProgress, Completed, Closed
        public string? ForwardingNotes { get; set; } // โน๊ตจาก Dean ตอนส่งต่อ
        public string? ProcessingNotes { get; set; } // โน๊ตจากเจ้าหน้าที่ตอนดำเนินการ
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ReceivedDate { get; set; } // วันที่เจ้าหน้าที่รับเรื่อง
        public DateTime? CompletedDate { get; set; } // วันที่ดำเนินการเสร็จ
        public DateTime? ClosedDate { get; set; } // วันที่คณบดีอนุมัติปิดเรื่อง
        public bool IsActive { get; set; } = true;
    }
}
