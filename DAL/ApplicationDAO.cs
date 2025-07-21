using BO.dtos.Request;
using BO.dtos.Response;
using BO.Models;
using DAL;
using DAL.Files;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

public class ApplicationDAO
{
    private readonly AppDbContext _context;
    private readonly IFileService _fileService;

    public ApplicationDAO(AppDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    // 1. Create New Application (Draft)
    public async Task<ApplicationResponse> CreateDraftAsync(int studentId, ApplicationRequest request)
    {           
        var program = await _context.Programs
            .FirstOrDefaultAsync(p => p.id == request.ProgramId);
        if (string.IsNullOrEmpty(request.StudentName))
            throw new ArgumentException("Student name is required");

        if (string.IsNullOrEmpty(request.Student_Phone))
            throw new ArgumentException("Student phone is required");

        if (program == null)
            throw new KeyNotFoundException("Program not found");

        var application = new Applications
        {
            student_id = studentId,
            student_name = request.StudentName,
            MyPhone = request.Student_Phone,
            programs_id = request.ProgramId,
            submitted_at = DateTime.UtcNow,            
            Status = ApplicationStatus.Draft,
            PortfolioLink = request.PortfolioLink,
            OtherLink = request.OtherLink
        };


       
        // Handle image upload
        if (request.Image != null)
        {
            application.ImagePath = await _fileService.SaveFileAsync(request.Image);
        }

        // Handle document uploads
        if (request.Documents != null && request.Documents.Count > 0)
        {
            var docPaths = new List<string>();
            foreach (var doc in request.Documents)
            {
                docPaths.Add(await _fileService.SaveFileAsync(doc));
            }
            application.DocumentPaths = JsonSerializer.Serialize(docPaths);
        }

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
        application.updated_at = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToResponse(application);
    }

    // 3. Get Application by ID
    public async Task<ApplicationResponse> GetByIdAsync(string id)
    {
        var application = await _context.Applications
            .Include(a => a.Programs)
            .Include(a => a.Student)
            .FirstOrDefaultAsync(a => a.id == id);

        if (application == null) return null;

        return MapToResponse(application);
    }

    public async Task<List<ApplicationResponse>> GetSubmittedApplicationsAsync()
    {
        return await _context.Applications
         .Where(a => a.Status != ApplicationStatus.Draft) // Exclude Draft
         .Include(a => a.Programs)
         .Include(a => a.Student)
         .OrderByDescending(a => a.submitted_at) // Newest first
         .Select(a => MapToResponse(a))
         .ToListAsync();
    }


    // 4. Get Applications by Student
    public async Task<List<ApplicationResponse>> GetByStudentAsync(int studentId)
    {
        return await _context.Applications
            .Where(a => a.student_id == studentId)
            .Include(a => a.Programs)
            .Select(a => MapToResponse(a))
            .ToListAsync();
    }

    // 5. Update Application (Student)
    public async Task<ApplicationResponse> UpdateAsync(string id, UpdateApplicationRequest request)
    {
        var application = await _context.Applications
            .Include(a => a.Programs)
            .FirstOrDefaultAsync(a => a.id == id);

        if (application == null)
            throw new KeyNotFoundException("Application not found");

        if (application.Status != ApplicationStatus.Draft)
            throw new InvalidOperationException("Only draft applications can be modified");

        // Update student info if provided
        if (!string.IsNullOrEmpty(request.StudentName))
        {
            application.student_name = request.StudentName; // Update application's name field
        }

        if (!string.IsNullOrEmpty(request.Student_Phone))
        {
            application.MyPhone = request.Student_Phone; // Update application's phone field
        }

        // Update program if changed
        if (!string.IsNullOrEmpty(request.ProgramId) && application.programs_id != request.ProgramId)
        {
            application.programs_id = request.ProgramId;
            await _context.Entry(application)
           .Reference(a => a.Programs)
           .LoadAsync();
        }
        // Handle image upload
        if (request.Image != null)
        {
            // Delete old image if exists
            if (!string.IsNullOrEmpty(application.ImagePath))
            {
                await _fileService.DeleteFileAsync(application.ImagePath);
            }
            application.ImagePath = await _fileService.SaveFileAsync(request.Image);
        }
        // Handle document uploads
        if (request.Documents != null && request.Documents.Count > 0)
        {
            // Delete old documents if they exist
            var oldDocPaths = TryDeserializeDocumentPaths(application.DocumentPaths);
            foreach (var docPath in oldDocPaths)
            {
                if (!string.IsNullOrEmpty(docPath))
                {
                    await _fileService.DeleteFileAsync(docPath);
                }
            }
            var docPaths = new List<string>();
            foreach (var doc in request.Documents)
            {
                docPaths.Add(await _fileService.SaveFileAsync(doc));
            }
            application.DocumentPaths = JsonSerializer.Serialize(docPaths);
        }

        if (request.PortfolioLink != null)
        {
            application.PortfolioLink = request.PortfolioLink;
        }
        if (request.OtherLink != null)
        {
            application.OtherLink = request.OtherLink;
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
                if (newStatus != ApplicationStatus.Approved &&
                    newStatus != ApplicationStatus.Rejected)
                    throw new InvalidOperationException("Submitted applications can only move to UnderReview or Rejected");
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
        var response = new ApplicationResponse
        {
            Id = application.id,
            StudentId = application.student_id,
            ProgramId = application.programs_id,
            ProgramTitle = application.Programs?.title,
            ImageUrl = application.ImagePath,
            PortfolioLink = application.PortfolioLink,
            OtherLink = application.OtherLink,
            SubmittedAt = application.submitted_at,
            Status = application.Status,
            StudentName = application.student_name, // Now using application's name
            StudentPhone = application.MyPhone,
            DocumentUrls = TryDeserializeDocumentPaths(application.DocumentPaths)
        };
       
        return response;
    }

    // Helper method for safe deserialization

    private static List<string> TryDeserializeDocumentPaths(string json)
    {
        try
        {
            return string.IsNullOrEmpty(json)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(json) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }
}