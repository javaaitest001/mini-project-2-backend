package com.worldcup.site.dto;

import com.worldcup.site.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record RegisterRequest(@Email String email, @NotBlank String password, @NotBlank String name) {}
    public record AuthResponse(String token, String email, String name, Role role) {}
}
