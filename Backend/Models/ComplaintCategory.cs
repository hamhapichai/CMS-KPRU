using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.Models
{
    public class ComplaintCategory
    {
    [Key]
    public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ICollection<ComplaintCategoryMap>? ComplaintCategoryMaps { get; set; }
    }
}
