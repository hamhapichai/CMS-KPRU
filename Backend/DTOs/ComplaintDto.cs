using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ComplaintCreateDto
    {
        public string? ContactName { get; set; }
        
        [EmailAddress]
        public string? ContactEmail { get; set; }
        
        public string? ContactPhone { get; set; }
        
        [Required]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public string Message { get; set; } = string.Empty;
        
        public bool IsAnonymous { get; set; }
    }

    public class ComplaintResponseDto
    {
        public int ComplaintId { get; set; }
        public string? ContactName { get; set; }
        public string ContactEmail { get; set; } = string.Empty;
        public string? ContactPhone { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsAnonymous { get; set; }
        public DateTime SubmissionDate { get; set; }
        public string CurrentStatus { get; set; } = string.Empty;
        public Guid TicketId { get; set; }
        public List<AttachmentDto> Attachments { get; set; } = new List<AttachmentDto>();
    }

    public class AttachmentDto
    {
        public int AttachmentId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
    }

    public class ForwardComplaintDto
    {
        [Required]
        public int DepartmentId { get; set; }
        
        public string? Notes { get; set; }
    }

    public class ComplaintDetailDto : ComplaintResponseDto
    {
        public List<ComplaintLogDto> ComplaintLogs { get; set; } = new List<ComplaintLogDto>();
        public List<ComplaintAssignmentDto> Assignments { get; set; } = new List<ComplaintAssignmentDto>();
    }

    public class ComplaintLogDto
    {
        public int LogId { get; set; }
        public DateTime Timestamp { get; set; }
        public string LogType { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public int? UserId { get; set; }
    }

    public class ComplaintAssignmentDto
    {
        public int AssignmentId { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public DateTime AssignedDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class AISuggestionDto
    {
        public int SuggestionId { get; set; }
        public int ComplaintId { get; set; }
        public string SuggestionText { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
        public DateTime GeneratedAt { get; set; }
    }
}
