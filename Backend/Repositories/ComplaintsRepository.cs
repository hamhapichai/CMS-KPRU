using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ComplaintsRepository : IComplaintsRepository
    {
        private readonly AppDbContext _context;

        public ComplaintsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Complaint> CreateAsync(Complaint complaint)
        {
            _context.Complaints.Add(complaint);
            await _context.SaveChangesAsync();
            return complaint;
        }

        public async Task<Complaint?> GetByIdAsync(int id)
        {
            return await _context.Complaints
                .Include(c => c.Attachments)
                .FirstOrDefaultAsync(c => c.ComplaintId == id);
        }

        public async Task<IEnumerable<Complaint>> GetAllAsync()
        {
            return await _context.Complaints
                .Include(c => c.Attachments)
                .OrderByDescending(c => c.SubmissionDate)
                .ToListAsync();
        }

        public async Task<Complaint?> GetDetailByIdAsync(int id)
        {
            return await _context.Complaints
                .Include(c => c.Attachments)
                .Include(c => c.ComplaintLogs)
                .Include(c => c.ComplaintAssignments)
                    .ThenInclude(ca => ca.AssignedToDept)
                .FirstOrDefaultAsync(c => c.ComplaintId == id);
        }

        public async Task<AISuggestion?> GetAISuggestionsByComplaintIdAsync(int complaintId)
        {
            return await _context.AISuggestions
                .Where(s => s.ComplaintId == complaintId)
                .FirstOrDefaultAsync();
        }

        public async Task<Complaint> UpdateAsync(Complaint complaint)
        {
            _context.Complaints.Update(complaint);
            await _context.SaveChangesAsync();
            return complaint;
        }

        public async Task<ComplaintAssignment> AddAssignmentAsync(ComplaintAssignment assignment)
        {
            _context.ComplaintAssignments.Add(assignment);
            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<ComplaintLog> AddLogAsync(ComplaintLog log)
        {
            _context.ComplaintLogs.Add(log);
            await _context.SaveChangesAsync();
            return log;
        }

        public async Task<List<Attachment>> AddAttachmentsAsync(int complaintId, List<IFormFile> files, string uploadPath)
        {
            var attachments = new List<Attachment>();

            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var attachment = new Attachment
                    {
                        ComplaintId = complaintId,
                        FileName = file.FileName,
                        FileUrl = $"/uploads/{fileName}",
                        FileType = file.ContentType,
                        UploadedAt = DateTime.UtcNow
                    };

                    _context.Attachments.Add(attachment);
                    attachments.Add(attachment);
                }
            }

            await _context.SaveChangesAsync();
            return attachments;
        }

        public async Task<Department?> GetDepartmentByIdAsync(int departmentId)
        {
            return await _context.Departments.FindAsync(departmentId);
        }
    }
}
