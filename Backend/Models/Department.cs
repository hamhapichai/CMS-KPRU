namespace Backend.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsDeleted { get; set; } = false;
    public ICollection<User>? Users { get; set; }
    public ICollection<ComplaintAssignment>? ComplaintAssignments { get; set; }
    }
}
