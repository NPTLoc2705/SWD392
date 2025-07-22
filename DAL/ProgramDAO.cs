using BO.Models;
using BO.dtos.Request;
using BO.dtos.Response;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL
{
    public class ProgramDAO
    {
        private readonly AppDbContext _context;

        public ProgramDAO(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ProgramResponse> CreateAsync(CreateProgramRequest program)
        {
            var newProgram = new Programs
            {
                title = program.Title,
                description = program.Description,
                admission_requirements = program.AdmissionRequirements, // Direct string assignment
                tuition_fee = program.TuitionFee,
                dormitory_info = program.DormitoryInfo,
                is_active = program.IsActive,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow
            };

            await _context.Programs.AddAsync(newProgram);
            await _context.SaveChangesAsync();
            return await GetByIdAsync(newProgram.id);
        }

        public async Task<ProgramResponse> DeleteAsync(string id)
        {
            var response = new ProgramResponse();
            try
            {
                var existingProgram = await _context.Programs.FindAsync(id);
                if (existingProgram == null)
                {
                    response.message = $"Program with ID {id} not found";
                    return response;
                }

                existingProgram.is_active = false;
                existingProgram.updated_at = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                response.message = "Program deactivated successfully";
                response.Id = id;
                return response;
            }
            catch (Exception ex)
            {
                response.message = $"Error deactivating program: {ex.Message}";
                return response;
            }
        }

        public async Task<IEnumerable<ProgramResponse>> GetAllAsync()
        {
            return await _context.Programs
                .OrderByDescending(t => t.updated_at)
                .Where(t => t.is_active)
                .Select(t => new ProgramResponse
                {
                    Id = t.id,
                    Title = t.title,
                    Description = t.description,
                    AdmissionRequirements = t.admission_requirements,
                    TuitionFee = t.tuition_fee,
                    DormitoryInfo = t.dormitory_info,
                    IsActive = t.is_active,
                    CreatedAt = t.created_at,
                    UpdatedAt = t.updated_at
                }).ToListAsync();
        }
        public async Task<IEnumerable<ProgramResponse>> GetAllForAdminAsync()
        {
            return await _context.Programs
                .OrderByDescending(t => t.updated_at)
                
                .Select(t => new ProgramResponse
                {
                    Id = t.id,
                    Title = t.title,
                    Description = t.description,
                    AdmissionRequirements = t.admission_requirements,
                    TuitionFee = t.tuition_fee,
                    DormitoryInfo = t.dormitory_info,
                    IsActive = t.is_active,
                    CreatedAt = t.created_at,
                    UpdatedAt = t.updated_at
                }).ToListAsync();
        }

        public async Task<ProgramResponse> GetByIdAsync(string id)
        {
            return await _context.Programs
                .Where(t => t.id == id)
                .Select(t => new ProgramResponse
                {
                    Id = t.id,
                    Title = t.title,
                    Description = t.description,
                    AdmissionRequirements = t.admission_requirements,
                    TuitionFee = t.tuition_fee,
                    DormitoryInfo = t.dormitory_info,
                    IsActive = t.is_active,
                    CreatedAt = t.created_at,
                    UpdatedAt = t.updated_at
                }).FirstOrDefaultAsync();
        }

        public async Task<bool> ProgramExistsAsync(string id)
        {
            return await _context.Programs.AnyAsync(p => p.id == id);
        }

        public async Task<ProgramResponse> UpdateAsync(string id, UpdateProgramRequest program)
        {
            var existingProgram = await _context.Programs.FindAsync(id);
            if (existingProgram == null)
            {
                throw new KeyNotFoundException($"Program with ID {id} not found.");
            }

            // Only update fields that were explicitly provided
            if (program.Title != null)
                existingProgram.title = program.Title;

            if (program.Description != null)
                existingProgram.description = program.Description;

            if (program.AdmissionRequirements != null)
                existingProgram.admission_requirements = program.AdmissionRequirements; // Direct string assignment

            if (program.TuitionFee != default)
                existingProgram.tuition_fee = program.TuitionFee;

            if (program.DormitoryInfo != null)
                existingProgram.dormitory_info = program.DormitoryInfo;

            existingProgram.is_active = program.IsActive;
            existingProgram.updated_at = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new ProgramResponse
            {
                Id = existingProgram.id,
                Title = existingProgram.title,
                Description = existingProgram.description,
                AdmissionRequirements = existingProgram.admission_requirements,
                TuitionFee = existingProgram.tuition_fee,
                DormitoryInfo = existingProgram.dormitory_info,
                IsActive = existingProgram.is_active,
                CreatedAt = existingProgram.created_at,
                UpdatedAt = existingProgram.updated_at
            };
        }
    }
}