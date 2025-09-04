using System.ComponentModel.DataAnnotations;
namespace Backend.Models
{
    public class ComplaintCategoryMap
    {
    [Key]
    public int MapId { get; set; }
        public int ComplaintId { get; set; }
    public Complaint? Complaint { get; set; }
        public int CategoryId { get; set; }
    public ComplaintCategory? Category { get; set; }
    }
}
