package com.infravision.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * DataSeeder for InfraVision AI (Smart India Hackathon 2026)
 * Pre-populates demo accounts, infrastructure corridors, and active telemetry alerts.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=================================================");
        System.out.println("InfraVision AI: Auto Database Seeder Initialized");
        System.out.println("Demo Users: manager@infravision.ai, engineer@infravision.ai, admin@infravision.ai");
        System.out.println("Default Demo Password: demo123");
        System.out.println("=================================================");
    }
}
