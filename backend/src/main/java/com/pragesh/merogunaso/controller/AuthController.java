package com.pragesh.merogunaso.controller;

import com.pragesh.merogunaso.dto.AuthRequest;
import com.pragesh.merogunaso.dto.AuthResponse;
import com.pragesh.merogunaso.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }

    // Super Admin Creation code will delete it after creation of super admin
    // Secret setup endpoint to generate a Super Admin (Must be disabled in production)
    @PostMapping("/setup")
    public ResponseEntity<AuthResponse> setupAdmin(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password) {
        try {
            AuthResponse response = authService.setupInitialAdmin(name, email, password);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
