package com.pragesh.merogunaso.controller;

import com.pragesh.merogunaso.dto.AuthRequest;
import com.pragesh.merogunaso.dto.AuthResponse;
import com.pragesh.merogunaso.dto.SetupRequest;
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
    public ResponseEntity<?> setupAdmin(
            @RequestBody(required = false) SetupRequest body,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password) {
        try {
            String reqName = body != null && body.getName() != null ? body.getName() : name;
            String reqEmail = body != null && body.getEmail() != null ? body.getEmail() : email;
            String reqPassword = body != null && body.getPassword() != null ? body.getPassword() : password;

            if (reqName == null || reqEmail == null || reqPassword == null) {
                return ResponseEntity.badRequest().body("Name, email, and password are required.");
            }

            AuthResponse response = authService.setupInitialAdmin(reqName, reqEmail, reqPassword);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

