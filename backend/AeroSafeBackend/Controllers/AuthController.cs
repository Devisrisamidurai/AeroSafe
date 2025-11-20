using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AeroSafeBackend.DTOs;
using AeroSafeBackend.Services;

namespace AeroSafeBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("admin/signup")]
    public async Task<ActionResult<AuthResponse>> AdminSignup([FromBody] AdminSignupRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Invalid request data"
            });
        }

        var result = await _authService.AdminSignupAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("pilot/signup")]
    public async Task<ActionResult<AuthResponse>> PilotSignup([FromBody] PilotSignupRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Invalid request data"
            });
        }

        var result = await _authService.PilotSignupAsync(request);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Invalid request data"
            });
        }

        var result = await _authService.LoginAsync(request);

        if (!result.Success)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    [HttpGet("verify")]
    [Authorize]
    public ActionResult<object> VerifyToken()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = User.FindFirstValue(ClaimTypes.Email);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var uid = User.FindFirstValue("Uid");
        var name = User.FindFirstValue("Name");

        return Ok(new
        {
            Success = true,
            Message = "Token is valid",
            User = new
            {
                Id = userId,
                Email = email,
                Role = role,
                Uid = uid,
                Name = name
            },
            Claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList()
        });
    }
}
