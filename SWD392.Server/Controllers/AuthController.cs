using BO.dtos;
using BO.dtos.Request;
using Microsoft.AspNetCore.Mvc;
using Services.Service;


namespace SWD392.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerDto)
        {
            try
            {
                var student = await _authService.Register(registerDto);
                return Ok(student);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginDto)
        {
            try
            {
                var response = await _authService.Login(loginDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleAuthDto googleAuthDto)
        {
            try
            {
                var response = await _authService.GoogleLogin(googleAuthDto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}