package com.infravision.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * AuthController for InfraVision AI (SIH 2026)
 * Handles login, registration, and JWT token issuing.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Email and password are required"));
        }

        // Demo user check
        Map<String, Object> user = new HashMap<>();
        user.put("email", email);
        user.put("fullName", "Rajesh Kumar");
        user.put("role", "Project Manager");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", "demo-jwt-token-" + System.currentTimeMillis());
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> payload) {
        String fullName = payload.get("fullName");
        String email = payload.get("email");
        String role = payload.getOrDefault("role", "Project Manager");

        Map<String, Object> user = new HashMap<>();
        user.put("fullName", fullName);
        user.put("email", email);
        user.put("role", role);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", "jwt-registered-" + System.currentTimeMillis());
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}
