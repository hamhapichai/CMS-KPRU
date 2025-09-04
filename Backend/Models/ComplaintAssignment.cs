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
        public int? AssignedToDeptId { get; set; }
        public Department? AssignedToDept { get; set; }
        public int? AssignedByUserId { get; set; }
        public User? AssignedByUser { get; set; }
        public int? AISuggestionDeptId { get; set; }
        public Department? AISuggestionDept { get; set; }
        public string Status { get; set; } = "Assigned";
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        public bool ConfirmedByDean { get; set; } = false;
    }
}
