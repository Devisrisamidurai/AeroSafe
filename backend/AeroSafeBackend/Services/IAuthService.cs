using AeroSafeBackend.DTOs;

namespace AeroSafeBackend.Services;

public interface IAuthService
{
    Task<AuthResponse> AdminSignupAsync(AdminSignupRequest request);
    Task<AuthResponse> PilotSignupAsync(PilotSignupRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}



