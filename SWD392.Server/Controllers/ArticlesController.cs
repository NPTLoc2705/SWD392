using BO.dtos.Request;
using BO.dtos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Service;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SWD392.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly IArticleService _articleService;

        public ArticlesController(IArticleService articleService)
        {
            _articleService = articleService ?? throw new ArgumentNullException(nameof(articleService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllArticles()
        {
            try
            {
                var articles = await _articleService.GetAllArticles();
                return Ok(new
                {
                    success = true,
                    data = articles,
                    message = "Articles retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving articles",
                    error = ex.Message
                });
            }
        }

        [HttpGet("paginated")]
        public async Task<IActionResult> GetArticlesPaginated([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                if (pageNumber <= 0)
                    return BadRequest(new { success = false, message = "Page number must be greater than 0" });

                if (pageSize <= 0 || pageSize > 100)
                    return BadRequest(new { success = false, message = "Page size must be between 1 and 100" });

                var paginatedResult = await _articleService.GetArticlesPaginated(pageNumber, pageSize);
                return Ok(new
                {
                    success = true,
                    data = paginatedResult,
                    message = "Paginated articles retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving paginated articles",
                    error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticleById(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return BadRequest(new { success = false, message = "Article ID cannot be empty" });

                var article = await _articleService.GetArticleById(id);

                if (article == null)
                    return NotFound(new { success = false, message = "Article not found" });

                return Ok(new
                {
                    success = true,
                    data = article,
                    message = "Article retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving the article",
                    error = ex.Message
                });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetArticlesByUserId(int userId)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest(new { success = false, message = "User ID must be greater than 0" });

                var articles = await _articleService.GetArticlesByUserId(userId);
                return Ok(new
                {
                    success = true,
                    data = articles,
                    message = "User articles retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving user articles",
                    error = ex.Message
                });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [RequestFormLimits(MultipartBodyLengthLimit = 20971520)] // 20MB limit
        public async Task<IActionResult> CreateArticle([FromForm] CreateArticleRequest createArticleRequest, [FromForm] IFormFile image)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new
                    {
                        success = false,
                        message = "Validation failed",
                        errors = errors
                    });
                }

                // Get user ID from JWT token claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user authentication" });
                }

                createArticleRequest.PublishedBy = userId;

                byte[] imageData = null;
                if (image != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream);
                        imageData = memoryStream.ToArray();
                    }
                }

                var createdArticle = await _articleService.UploadArticle(createArticleRequest, imageData);

                return CreatedAtAction(
                    nameof(GetArticleById),
                    new { id = createdArticle.Id },
                    new
                    {
                        success = true,
                        data = createdArticle,
                        message = "Article created successfully"
                    });
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while creating the article",
                    error = ex.Message
                });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        [RequestFormLimits(MultipartBodyLengthLimit = 20971520)] // 20MB limit
        public async Task<IActionResult> UpdateArticle(string id, [FromForm] UpdateArticleRequest updateArticleRequest, [FromForm] IFormFile image = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return BadRequest(new { success = false, message = "Article ID cannot be empty" });

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(new
                    {
                        success = false,
                        message = "Validation failed",
                        errors = errors
                    });
                }

                // Get user ID from JWT token claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user authentication" });
                }

                // Check if article exists and belongs to the user
                var existingArticle = await _articleService.GetArticleById(id);
                if (existingArticle == null)
                    return NotFound(new { success = false, message = "Article not found" });

                if (existingArticle.PublishedBy != userId)
                    return Forbid("You can only update your own articles");

                byte[] imageData = null;
                if (image != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream);
                        imageData = memoryStream.ToArray();
                    }
                }

                var updatedArticle = await _articleService.UpdateArticle(id, updateArticleRequest, imageData);

                return Ok(new
                {
                    success = true,
                    data = updatedArticle,
                    message = "Article updated successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while updating the article",
                    error = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteArticle(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return BadRequest(new { success = false, message = "Article ID cannot be empty" });

                // Get user ID from JWT token claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user authentication" });
                }

                // Check if article exists and belongs to the user
                var existingArticle = await _articleService.GetArticleById(id);
                if (existingArticle == null)
                    return NotFound(new { success = false, message = "Article not found" });

                if (existingArticle.PublishedBy != userId)
                    return Forbid("You can only delete your own articles");

                var deleted = await _articleService.DeleteArticle(id);

                if (!deleted)
                    return NotFound(new { success = false, message = "Article not found or could not be deleted" });

                return Ok(new
                {
                    success = true,
                    message = "Article deleted successfully"
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while deleting the article",
                    error = ex.Message
                });
            }
        }

        [HttpGet("my-articles")]
        [Authorize]
        public async Task<IActionResult> GetMyArticles()
        {
            try
            {
                // Get user ID from JWT token claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { success = false, message = "Invalid user authentication" });
                }

                var articles = await _articleService.GetArticlesByUserId(userId);
                return Ok(new
                {
                    success = true,
                    data = articles,
                    message = "Your articles retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred while retrieving your articles",
                    error = ex.Message
                });
            }
        }
    }
}