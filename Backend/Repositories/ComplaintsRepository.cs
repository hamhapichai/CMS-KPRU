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

        public async Task<Complaint?> GetByTicketIdAsync(Guid ticketId)
        {
            return await _context.Complaints
                .Include(c => c.Attachments)
                .FirstOrDefaultAsync(c => c.TicketId == ticketId);
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

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Department)
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<ComplaintAssignment?> GetActiveAssignmentByComplaintIdAsync(int complaintId)
        {
            return await _context.ComplaintAssignments
                .Include(ca => ca.AssignedToDept)
                .Include(ca => ca.AssignedByUser)
                .Include(ca => ca.AssignedToUser)
                .Where(ca => ca.ComplaintId == complaintId && ca.IsActive)
                .OrderByDescending(ca => ca.AssignedDate)
                .FirstOrDefaultAsync();
        }

        public async Task<ComplaintAssignment> UpdateAssignmentAsync(ComplaintAssignment assignment)
        {
            _context.ComplaintAssignments.Update(assignment);
            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<List<ComplaintLog>> GetLogsByComplaintIdAsync(int complaintId)
        {
            return await _context.ComplaintLogs
                .Include(l => l.User)
                .Include(l => l.Department)
                .Where(l => l.ComplaintId == complaintId)
                .OrderBy(l => l.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<Complaint>> GetComplaintsByDepartmentAsync(int departmentId)
        {
            return await _context.Complaints
                .Include(c => c.ComplaintAssignments.Where(ca => ca.IsActive))
                    .ThenInclude(ca => ca.AssignedToDept)
                .Include(c => c.ComplaintAssignments.Where(ca => ca.IsActive))
                    .ThenInclude(ca => ca.AssignedByUser)
                .Include(c => c.ComplaintAssignments.Where(ca => ca.IsActive))
                    .ThenInclude(ca => ca.AssignedToUser)
                .Where(c => c.ComplaintAssignments.Any(ca => ca.AssignedToDeptId == departmentId && ca.IsActive))
                .OrderByDescending(c => c.SubmissionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Complaint>> GetComplaintsByUserDepartmentAsync(int userId)
        {
            // ก่อนอื่นหา Department ของ User
            var user = await _context.Users
                .Where(u => u.UserId == userId && u.IsActive)
                .Select(u => new { u.DepartmentId })
                .FirstOrDefaultAsync();
            
            if (user?.DepartmentId == null)
            {
                return new List<Complaint>();
            }
            
            // ดึงเรื่องร้องเรียนที่ถูก assign ไปยัง department ของ user นี้
            return await _context.Complaints
                .Include(c => c.ComplaintAssignments.Where(ca => ca.IsActive))
                    .ThenInclude(ca => ca.AssignedToDept)
                .Include(c => c.ComplaintAssignments.Where(ca => ca.IsActive))
                    .ThenInclude(ca => ca.AssignedByUser)
                .Include(c => c.ComplaintAssignments.Where(ca => ca.IsActive))
                    .ThenInclude(ca => ca.AssignedToUser)
                .Include(c => c.Attachments)
                .Where(c => c.ComplaintAssignments.Any(ca => 
                    ca.AssignedToDeptId == user.DepartmentId && ca.IsActive))
                .OrderByDescending(c => c.SubmissionDate)
                .ToListAsync();
        }

        public async Task<List<object>> GetComplaintAssignmentsAsync(int complaintId)
        {
            return await _context.ComplaintAssignments
                .Where(a => a.ComplaintId == complaintId)
                .Include(a => a.AssignedToDept)
                .Select(a => new
                {
                    a.AssignmentId,
                    a.ComplaintId,
                    a.AssignedToDeptId,
                    DepartmentName = a.AssignedToDept != null ? a.AssignedToDept.DepartmentName : null,
                    a.AssignedByUserId,
                    a.ForwardingNotes,
                    a.AssignedDate,
                    a.Status,
                    a.IsActive
                })
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<List<object>> GetComplaintLogsAsync(int complaintId)
        {
            var logs = await _context.ComplaintLogs
                .Where(l => l.ComplaintId == complaintId)
                .Include(l => l.Department)
                .OrderBy(l => l.Timestamp)
                .Select(l => new
                {
                    l.LogId,
                    l.ComplaintId,
                    l.Timestamp,
                    l.Action,
                    l.Notes,
                    l.UserId,
                    l.DepartmentId,
                    DepartmentName = l.Department != null ? l.Department.DepartmentName : null,
                    l.PreviousStatus,
                    l.NewStatus
                })
                .ToListAsync();
            
            return logs.Cast<object>().ToList();
        }
    }
}
