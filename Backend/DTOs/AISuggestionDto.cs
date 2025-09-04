using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class AISuggestionCreateDto
    {
        [Required(ErrorMessage = "ComplaintId is required")]
        public int ComplaintId { get; set; }
        
        public int? SuggestedDeptId { get; set; }
        
        [MaxLength(200)]
        public string? SuggestedCategory { get; set; }
        
        [Range(0.0, 1.0, ErrorMessage = "ConfidenceScore must be between 0 and 1")]
        public float? ConfidenceScore { get; set; }
        
        [MaxLength(100)]
        public string? N8nWorkflowId { get; set; }
    }

    public class AISuggestionCallbackDto
    {
        [Required(ErrorMessage = "ComplaintId is required")]
        public int ComplaintId { get; set; }
        
        public int? SuggestedDeptId { get; set; }
        
        [MaxLength(200)]
        public string? SuggestedCategory { get; set; }
        
        [Range(0.0, 1.0, ErrorMessage = "ConfidenceScore must be between 0 and 1")]
        public float? ConfidenceScore { get; set; }
        
        [MaxLength(100)]
        public string? N8nWorkflowId { get; set; }
    }

    public class AISuggestionResponseDto
    {
        public int AISuggestionId { get; set; }
        public int ComplaintId { get; set; }
        public int? SuggestedDeptId { get; set; }
        public string? DepartmentName { get; set; }
        public string? SuggestedCategory { get; set; }
        public float? ConfidenceScore { get; set; }
        public DateTime SuggestedAt { get; set; }
        public string? N8nWorkflowId { get; set; }
    }

    public class AISuggestionCallbackResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public AISuggestionResponseDto? Data { get; set; }
    }
}
