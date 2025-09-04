using System;

namespace Backend.Models
{
    public class AISuggestion
    {
        public int AISuggestionId { get; set; }
        public int ComplaintId { get; set; }
    public Complaint? Complaint { get; set; }
        public int? SuggestedDeptId { get; set; }
        public Department? SuggestedDept { get; set; }
        public string? SuggestedCategory { get; set; }
        public float? ConfidenceScore { get; set; }
        public DateTime SuggestedAt { get; set; } = DateTime.UtcNow;
        public string? N8nWorkflowId { get; set; }
    }
}
