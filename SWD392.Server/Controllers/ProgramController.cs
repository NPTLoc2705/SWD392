using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BO.dtos.Request;
using BO.dtos.Response;
using System.Collections.Generic;
using System.Threading.Tasks;
using Services.Ticket;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace YourProjectName.Controllers
{
    [ApiController]
    [Route("api/programs")]
    public class ProgramsController : ControllerBase
    {
        private readonly IProgramService _programService;
        private readonly ILogger<ProgramsController> _logger;

        public ProgramsController(
            IProgramService programService,
            ILogger<ProgramsController> logger)
        {
            _programService = programService;
            _logger = logger;
        }

        /// <summary>
        /// Get all active programs
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProgramResponse>>> GetAllPrograms()
        {
            try
            {
                var programs = await _programService.GetAllAsync();
                return Ok(programs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all programs");
                return StatusCode(500, new { message = "An error occurred while retrieving programs" });
            }
        }

        /// <summary>
        /// Get program by ID
        /// </summary>
        /// <param name="id">Program ID</param>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProgramResponse>> GetProgramById(string id)
        {
            try
            {
                var program = await _programService.GetByIdAsync(id);
                return program == null
                    ? NotFound(new { message = $"Program with ID {id} not found" })
                    : Ok(program);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving program with ID {id}");
                return StatusCode(500, new { message = "An error occurred while retrieving the program" });
            }
        }

        /// <summary>
        /// Create a new program (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProgramResponse>> CreateProgram([FromBody] CreateProgramRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Additional JSON validation
                if (request.AdmissionRequirements == null || request.AdmissionRequirements.Count == 0)
                {
                    ModelState.AddModelError("AdmissionRequirements", "Admission requirements cannot be empty");
                    return BadRequest(ModelState);
                }

                var createdProgram = await _programService.CreateAsync(request);
                return CreatedAtAction(nameof(GetProgramById), new { id = createdProgram.Id }, createdProgram);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new program");
                return StatusCode(500, new { message = "An error occurred while creating the program" });
            }
        }

        /// <summary>
        /// Update an existing program (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProgramResponse>> UpdateProgram([FromRoute] string id, [FromBody] UpdateProgramRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
              
                var updatedProgram = await _programService.UpdateAsync(id,request);
                return Ok(updatedProgram);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Program with ID {id} not found");
                return NotFound(new { message = $"Program with ID {id} not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating program with ID {id}");
                return StatusCode(500, new { message = "An error occurred while updating the program" });
            }
        }

        /// <summary>
        /// Soft delete a program (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProgram(string id)
        {
            try
            {
                var result = await _programService.DeleteAsync(id);

                if (result.error == 1)
                {
                    return NotFound(result); // Returns 404 with error message
                }

                return Ok(result); // Returns 200 with success message
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting program with ID {id}");
                return StatusCode(500, new ProgramResponse
                {
                    error = 1,
                    message = "An internal server error occurred while deleting the program"
                });
            }
        }

        /// <summary>
        /// Toggle program active status (Admin only)
        /// </summary>
        //[HttpPatch("{id}/toggle-active")]
        //[Authorize(Roles = "Admin")]
        //public async Task<ActionResult<ProgramResponse>> ToggleProgramActive(string id)
        //{
        //    try
        //    {
        //        var program = await _programService.GetByIdAsync(id);
        //        if (program == null)
        //        {
        //            return NotFound(new { message = $"Program with ID {id} not found" });
        //        }

        //        var updateRequest = new UpdateProgramRequest
        //        {
        //            Id = id,
        //            Title = program.Title,
        //            Description = program.Description,
        //            AdmissionRequirements = program.AdmissionRequirements,
        //            TuitionFee = program.TuitionFee,
        //            DormitoryInfo = program.DormitoryInfo,
        //            IsActive = !program.IsActive
        //        };

        //        var updatedProgram = await _programService.UpdateAsync(updateRequest);
        //        return Ok(new
        //        {
        //            message = "Program status toggled successfully",
        //            program = updatedProgram
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, $"Error toggling active status for program with ID {id}");
        //        return StatusCode(500, new { message = "An error occurred while toggling program status" });
        //    }
        //}
    }
}