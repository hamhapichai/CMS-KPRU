using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class Complaint
    {
        public int ComplaintId { get; set; }
        public string? ContactName { get; set; }
        public string ContactEmail { get; set; } = string.Empty;
        public string? ContactPhone { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime SubmissionDate { get; set; } = DateTime.UtcNow;
        public string CurrentStatus { get; set; } = "Submitted";
        public bool IsAnonymous { get; set; } = false;
        public Guid TicketId { get; set; } = Guid.NewGuid();
        public ICollection<Attachment> Attachments { get; set; }
        public ICollection<ComplaintAssignment> ComplaintAssignments { get; set; }
        public ICollection<ComplaintLog> ComplaintLogs { get; set; }
        public ICollection<AISuggestion> AISuggestions { get; set; }
        public ICollection<ComplaintCategoryMap> ComplaintCategoryMaps { get; set; }
        public string? AISummary { get; set; } // สรุปเรื่องจาก AI
    }
}
