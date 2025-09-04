using System;

namespace Backend.Models
{
    public class Attachment
    {
        public int AttachmentId { get; set; }
        public int ComplaintId { get; set; }
    public Complaint? Complaint { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
