package com.pragesh.merogunaso.service;

import com.pragesh.merogunaso.config.JwtService;
import com.pragesh.merogunaso.dto.AuthRequest;
import com.pragesh.merogunaso.dto.AuthResponse;
import com.pragesh.merogunaso.entity.AdminUser;
import com.pragesh.merogunaso.entity.Role;
import com.pragesh.merogunaso.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        AdminUser user = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getName(),
                user.getRole(),
                user.getDepartmentId(),
                jwtToken
        );
    }

    // A helper method for initial setup or testing to create a default SuperAdmin
    public AuthResponse setupInitialAdmin(String name, String email, String password) {
        Optional<AdminUser> existingUser = adminUserRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        AdminUser adminUser = new AdminUser(
                name,
                email,
                passwordEncoder.encode(password),
                Role.ROLE_SUPER_ADMIN,
                null
        );

        adminUserRepository.save(adminUser);

        String jwtToken = jwtService.generateToken(adminUser);

        return new AuthResponse(
                adminUser.getId().toString(),
                adminUser.getEmail(),
                adminUser.getName(),
                adminUser.getRole(),
                adminUser.getDepartmentId(),
                jwtToken
        );
    }
}
