using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

public class ApplicationDAO
{
    private readonly AppDbContext _context;

    public ApplicationDAO(AppDbContext context)
    {
        _context = context;
    }

    // 1. Create New Application (Draft)
    public async Task<ApplicationResponse> CreateDraftAsync( int studentId, ApplicationRequest request)
    {
        // Load program first to get the title
        var program = await _context.Programs
            .FirstOrDefaultAsync(p => p.id == request.ProgramId);

        if (program == null)
            throw new KeyNotFoundException("Program not found");

        var application = new Applications
        {
            student_id = studentId,
            programs_id = request.ProgramId,
            submission_data = JsonSerializer.Serialize(request.SubmissionData),
            submitted_at = DateTime.UtcNow,
            Status = ApplicationStatus.Draft,
            Programs = program // Set the navigation property
        };

        await _context.Applications.AddAsync(application);
        await _context.SaveChangesAsync();

        return MapToResponse(application);
    }

    // 2. Submit Application (Draft → Submitted)
    public async Task<ApplicationResponse> SubmitApplicationAsync(string applicationId)
    {
        var application = await _context.Applications.FindAsync(applicationId);
        if (application == null) throw new KeyNotFoundException("Application not found");

        if (application.Status != ApplicationStatus.Draft)
            throw new InvalidOperationException("Only draft applications can be submitted");

        application.Status = ApplicationStatus.Submitted;
        application.submitted_at = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToResponse(application);
    }

    // 3. Get Application by ID
    public async Task<ApplicationResponse> GetByIdAsync(string id)
    {
        var application = await _context.Applications
            .Include(a => a.Programs)
            .FirstOrDefaultAsync(a => a.id == id);

        return application == null ? null : MapToResponse(application);
    }

    // 4. Get Applications by Student
    public async Task<List<ApplicationResponse>> GetByStudentAsync(int studentId)
    {
        return await _context.Applications
            .Where(a => a.student_id == studentId)
            .Include(a => a.Programs)
            .Select(a => new ApplicationResponse
            {
                Id = a.id,
                StudentId = a.student_id,
                ProgramId = a.programs_id,
                ProgramTitle = a.Programs != null ? a.Programs.title : string.Empty,
                SubmissionData = TryDeserializeSubmissionData(a.submission_data),
                SubmittedAt = a.submitted_at,
                Status = a.Status
            })
            .ToListAsync();
    }

    // 5. Update Application (Student)
    public async Task<ApplicationResponse> UpdateAsync(string id, UpdateApplicationRequest request)
    {
        var application = await _context.Applications
            .Include(a => a.Student) // Load student data
            .Include(a => a.Programs) // Load program data
            .FirstOrDefaultAsync(a => a.id == id);

        if (application == null)
            throw new KeyNotFoundException("Application not found");

        if (application.Status != ApplicationStatus.Draft)
            throw new InvalidOperationException("Only draft applications can be modified");

        // Update only provided fields
        if (request.SubmissionData != null)
        {
            application.submission_data = JsonSerializer.Serialize(request.SubmissionData);
        }

        if (!string.IsNullOrEmpty(request.StudentName) && application.Student != null)
        {
            application.Student.Name = request.StudentName;
        }

        if (!string.IsNullOrEmpty(request.Student_Phone) && application.Student != null)
        {
            application.Student.Phone = request.Student_Phone;
        }

        application.updated_at = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToResponse(application);
    }

    // 6. Change Application Status (Admin)
    // 6. Change Application Status (Admin) with proper status transitions
    public async Task<ApplicationResponse> ChangeStatusAsync(string id, ApplicationStatus newStatus)
    {
        var application = await _context.Applications.FindAsync(id);
        if (application == null) throw new KeyNotFoundException("Application not found");

        // Validate status transitions
        switch (application.Status)
        {
            case ApplicationStatus.Draft:
                if (newStatus != ApplicationStatus.Submitted)
                    throw new InvalidOperationException("Draft applications can only be submitted");
                break;

            case ApplicationStatus.Submitted:
                if (newStatus != ApplicationStatus.UnderReview &&
                    newStatus != ApplicationStatus.Rejected)
                    throw new InvalidOperationException("Submitted applications can only move to UnderReview or Rejected");
                break;

            case ApplicationStatus.UnderReview:
                if (newStatus != ApplicationStatus.Approved &&
                    newStatus != ApplicationStatus.Rejected &&
                    newStatus != ApplicationStatus.Waitlisted)
                    throw new InvalidOperationException("InReview applications can only move to Accepted, Rejected, or Waitlisted");
                break;

            case ApplicationStatus.Waitlisted:
                if (newStatus != ApplicationStatus.Approved &&
                    newStatus != ApplicationStatus.Rejected)
                    throw new InvalidOperationException("Waitlisted applications can only move to Accepted or Rejected");
                break;

            case ApplicationStatus.Approved:
            case ApplicationStatus.Rejected:
                throw new InvalidOperationException($"Application is already {application.Status} (terminal state)");
        }

        application.Status = newStatus;
        await _context.SaveChangesAsync();

        return MapToResponse(application);
    }

    // Helper method
    private static ApplicationResponse MapToResponse(Applications application)
    {
        return new ApplicationResponse
        {
            Id = application.id,
            StudentId = application.student_id,
            ProgramId = application.programs_id,
            ProgramTitle = application.Programs?.title,
            SubmissionData = JsonSerializer.Deserialize<Dictionary<string, object>>(application.submission_data),
            SubmittedAt = application.submitted_at,
            Status = application.Status
        };
    }
    // Helper method for safe deserialization

    private static Dictionary<string, object> TryDeserializeSubmissionData(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<Dictionary<string, object>>(json)
                   ?? new Dictionary<string, object>();
        }
        catch
        {
            return new Dictionary<string, object>();
        }
    }
}