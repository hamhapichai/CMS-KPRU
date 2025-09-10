using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ComplaintReceiveDto
    {
        [Required(ErrorMessage = "ComplaintId is required")]
        public int ComplaintId { get; set; }
        
        public string? Notes { get; set; }
        
        public int UserId { get; set; } // เจ้าหน้าที่ที่รับเรื่อง
    }

    public class ComplaintStartProgressDto
    {
        [Required(ErrorMessage = "ComplaintId is required")]
        public int ComplaintId { get; set; }
        
        public string? Notes { get; set; }
        
        public int UserId { get; set; } // เจ้าหน้าที่ที่เริ่มดำเนินการ
    }

    public class ComplaintCompleteDto
    {
        [Required(ErrorMessage = "ComplaintId is required")]
        public int ComplaintId { get; set; }
        
        [Required(ErrorMessage = "ProcessingNotes is required")]
        public string ProcessingNotes { get; set; } = string.Empty;
        
        public int UserId { get; set; } // เจ้าหน้าที่ที่ดำเนินการเสร็จ
    }

    public class ComplaintCloseDto
    {
        [Required(ErrorMessage = "ComplaintId is required")]
        public int ComplaintId { get; set; }
        
        public string? Notes { get; set; }
        
        public int UserId { get; set; } // คณบดีที่อนุมัติปิดเรื่อง
    }

    public class ComplaintRejectDto
    {
        [Required(ErrorMessage = "ComplaintId is required")]
        public int ComplaintId { get; set; }
        
        [Required(ErrorMessage = "Reason is required")]
        public string Reason { get; set; } = string.Empty;
        
        public int UserId { get; set; } // ผู้ปฏิเสธเรื่อง
    }

    public class ComplaintTrackingResponseDto
    {
        public int ComplaintId { get; set; }
        public string TicketId { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public List<ComplaintLogDto> Timeline { get; set; } = new List<ComplaintLogDto>();
        public ComplaintAssignmentDto? CurrentAssignment { get; set; }
    }
}
