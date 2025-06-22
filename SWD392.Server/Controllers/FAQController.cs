using BO.dtos.Request;
using BO.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Service;

namespace SWD392.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FAQController : ControllerBase
    {
        private readonly IFAQService _faqService;

        public FAQController(IFAQService faqService)
        {
            _faqService = faqService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateFAQ([FromBody] FAQRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _faqService.CreateFAQAsync(request);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFAQs()
        {
            var faqs = await _faqService.GetAllFAQsAsync();
            return Ok(faqs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFAQById(int id)
        {
            var faq = await _faqService.GetByIdAsync(id);
            if (faq == null)
                return NotFound();

            return Ok(faq);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<FAQ>> UpdateFAQ(int id, FAQRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedFaq = await _faqService.UpdateAsync(id, request);

            if (updatedFaq == null)
                return NotFound();

            return Ok(updatedFaq);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFAQ(int id)
        {
            var result = await _faqService.DeleteFAQAsync(id);
            if (!result)
                return NotFound();

            return Ok(new { message = "FAQ deleted successfully" });
        }
    }
}
